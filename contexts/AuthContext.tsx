import { supabase } from "@/lib/supabase";
import {
  getSignUpEmailRedirectTo,
  tryConsumeAuthDeepLinkUrl,
} from "@/lib/supabase/authRedirect";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User as AppUser } from "../types";

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    departmentId: string
  ) => Promise<{ data: { user?: { identities?: unknown[] } | null } | null; error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

type ProfileWithDepartment = {
  id: string;
  email: string | null;
  display_name: string | null;
  department_id: string | null;
  role: "member" | "manager" | "admin" | null;
  departments: { id: string; name: string } | { id: string; name: string }[] | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAppUser(profile: ProfileWithDepartment): AppUser {
  const departmentName =
    profile.departments && Array.isArray(profile.departments)
      ? (profile.departments[0]?.name ?? "")
      : (profile.departments?.name ?? "");

  return {
    id: profile.id,
    email: profile.email ?? "",
    displayName: profile.display_name ?? "",
    departmentId: profile.department_id ?? null,
    departmentName,
    // 既存画面が user.department を参照しているため当面は同値で保持
    department: departmentName ?? null,
    role: profile.role ?? "member",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfileById = useCallback(async (id: string) => {
    return supabase
      .from("profiles")
      .select(
        "id,email,display_name,department_id,role,departments ( id, name )"
      )
      .eq("id", id)
      .maybeSingle<ProfileWithDepartment>();
  }, []);

  const createProfileIfMissing = useCallback(async (supabaseUser: User) => {
    const displayNameMeta =
      (supabaseUser.user_metadata?.display_name as string | undefined) ?? null;
    const departmentIdMeta =
      (supabaseUser.user_metadata?.department_id as string | undefined) ?? null;

    const { error } = await supabase.from("profiles").insert({
      id: supabaseUser.id,
      email: supabaseUser.email ?? null,
      display_name: displayNameMeta,
      department_id: departmentIdMeta || null,
      role: "member",
    });

    if (error?.code === "23505") return { insertError: null };
    if (error) console.warn("[Auth] createProfileIfMissing: insert error", error);
    return { insertError: error };
  }, []);

  const fetchUserProfile = useCallback(
    async (supabaseUser: User) => {
      const initial = await getProfileById(supabaseUser.id);
      if (initial.error) {
        console.error("[Auth] fetchUserProfile: 取得失敗", initial.error);
        return;
      }

      let profile = initial.data;

      if (!profile) {
        const { insertError } = await createProfileIfMissing(supabaseUser);
        if (insertError) {
          console.error("[Auth] fetchUserProfile: プロフィール作成失敗", insertError);
          return;
        }
        const retry = await getProfileById(supabaseUser.id);
        if (retry.error || !retry.data) {
          console.error("[Auth] fetchUserProfile: 再取得失敗", retry.error);
          return;
        }
        profile = retry.data;
      }

      const metadataDisplayName =
        (supabaseUser.user_metadata?.display_name as string | undefined) ?? null;
      const metadataDepartmentId =
        (supabaseUser.user_metadata?.department_id as string | undefined) ?? null;

      const needsUpdate =
        (!profile.display_name || !profile.department_id) &&
        (metadataDisplayName || metadataDepartmentId);

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            display_name: profile.display_name || metadataDisplayName || null,
            department_id:
              profile.department_id || metadataDepartmentId || null,
          })
          .eq("id", supabaseUser.id);

        if (!updateError) {
          const updated = await getProfileById(supabaseUser.id);
          if (updated.data) profile = updated.data;
        } else {
          console.warn("[Auth] fetchUserProfile: 補完更新失敗", updateError);
        }
      }

      setUser(toAppUser(profile));
    },
    [createProfileIfMissing, getProfileById]
  );

  useEffect(() => {
    let mounted = true;
    const INIT_TIMEOUT_MS = 15_000;

    const initializeAuth = async () => {
      let timedOut = false;
      const timeoutId = setTimeout(() => {
        timedOut = true;
        if (mounted) {
          setLoading(false);
          setUser(null);
        }
      }, INIT_TIMEOUT_MS);

      try {
        if (mounted) setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        if (timedOut) return;
        if (error) throw error;

        if (data.session?.user) {
          await fetchUserProfile(data.session.user);
        } else if (mounted) {
          setUser(null);
        }
      } catch (e) {
        console.error("[Auth] initializeAuth error", e);
        if (mounted) setUser(null);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const IGNORED_EVENTS: AuthChangeEvent[] = ["INITIAL_SESSION", "TOKEN_REFRESHED"];

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (IGNORED_EVENTS.includes(event)) return;
        if (event === "PASSWORD_RECOVERY") {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        try {
          switch (event) {
            case "SIGNED_IN":
              if (!session?.user) return;
              if (mounted) setLoading(true);
              await fetchUserProfile(session.user);
              break;
            case "SIGNED_OUT":
              if (mounted) setUser(null);
              break;
            default:
              break;
          }
        } catch (e) {
          console.error("[Auth] onAuthStateChange error", e);
          if (mounted) setUser(null);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  useEffect(() => {
    const handle = async (url: string | null) => {
      if (!url) return;
      const { applied, isPasswordRecovery } = await tryConsumeAuthDeepLinkUrl(url);
      if (applied && isPasswordRecovery) {
        router.replace("/reset-password");
      }
    };
    void Linking.getInitialURL().then((u) => void handle(u));
    const sub = Linking.addEventListener("url", ({ url }) => void handle(url));
    return () => sub.remove();
  }, [router]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      departmentId: string
    ) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getSignUpEmailRedirectTo(),
          data: {
            display_name: displayName,
            department_id: departmentId,
          },
        },
      });

      if (error) return { data: null, error };
      return { data, error: null };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      await fetchUserProfile(data.session.user);
    }
  }, [fetchUserProfile]);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refreshUser }),
    [user, loading, signIn, signUp, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
