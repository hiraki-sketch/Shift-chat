// AuthContext.tsx
import { supabase } from "@/lib/supabase";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
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
    department: string
  ) => Promise<{ data: { user?: { identities?: unknown[] } | null } | null; error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * profilesテーブルにプロフィール行が無い場合に作る
   * - signUp時の user_metadata（display_name/department）から初期値を拾う想定
   * - 既に行があるのに insert すると重複エラーになるので、23505(ユニーク制約違反)は握りつぶす
   */
  const createProfileIfMissing = useCallback(async (supabaseUser: User) => {
    console.log("[Auth] createProfileIfMissing: start", supabaseUser.id);

    const display_name =
      (supabaseUser.user_metadata?.display_name as string | undefined) ?? null;
    const department =
      (supabaseUser.user_metadata?.department as string | undefined) ?? null;

    const { error } = await supabase.from("profiles").insert({
      id: supabaseUser.id,
      email: supabaseUser.email,
      display_name,
      department,
    });

    if (error?.code === "23505") {
      console.log("[Auth] createProfileIfMissing: 既存ユーザー(23505)");
      return { insertError: null };
    }
    if (error) console.warn("[Auth] createProfileIfMissing: insert error", error);
    return { insertError: error };
  }, []);

  /*
   * 認証ユーザー(User) → DB(profilesテーブル)のプロフィールを取得して setUser する
   * - プロフィールが無い場合は作成
   * - プロフィールがあるが display_name/department が null の場合は user_metadata から更新
   */
  const fetchUserProfile = useCallback(
    async (supabaseUser: User) => {
      console.log("[Auth] fetchUserProfile: start", supabaseUser.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,display_name,department")
        .eq("id", supabaseUser.id)
        .maybeSingle();

      // 取得時にエラー（RLS/権限/ネットワーク/SQL等）が出たら終了
      if (error) {
        console.error("[Auth] fetchUserProfile: 取得失敗", error);
        return;
      }

      // プロフィールが無い（0件）なら作成→再取得
      if (!data) {
        console.log("[Auth] fetchUserProfile: プロフィールなし→作成");
        const { insertError } = await createProfileIfMissing(supabaseUser);
        if (insertError) {
          console.error("[Auth] プロフィール作成失敗", insertError);
          return;
        }

        const retry = await supabase
          .from("profiles")
          .select("id,email,display_name,department")
          .eq("id", supabaseUser.id)
          .maybeSingle();

        if (retry.error || !retry.data) {
          console.error("[Auth] 再取得ミス", retry.error);
          return;
        }

        setUser({
          id: retry.data.id,
          email: retry.data.email,
          displayName: retry.data.display_name,
          department: retry.data.department,
        });
        console.log("[Auth] fetchUserProfile: 作成後セット完了");
        return;
      }

      // プロフィールが存在するが、display_name や department が null の場合
      // user_metadata から更新を試みる
      const needsUpdate =
        (!data.display_name || !data.department) &&
        (supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.department);

      if (needsUpdate) {
        console.log("[Auth] fetchUserProfile: プロフィール更新が必要");
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            display_name:
              data.display_name ||
              (supabaseUser.user_metadata?.display_name as string | undefined) ||
              null,
            department:
              data.department ||
              (supabaseUser.user_metadata?.department as string | undefined) ||
              null,
          })
          .eq("id", supabaseUser.id);

        if (updateError) {
          console.warn("[Auth] プロフィール更新失敗", updateError);
        } else {
          // 更新後、再取得
          const updated = await supabase
            .from("profiles")
            .select("id,email,display_name,department")
            .eq("id", supabaseUser.id)
            .maybeSingle();

          if (updated.data) {
            setUser({
              id: updated.data.id,
              email: updated.data.email,
              displayName: updated.data.display_name,
              department: updated.data.department,
            });
            console.log("[Auth] fetchUserProfile: 更新後セット完了");
            return;
          }
        }
      }

      // 取得できたらアプリ用の形に変換して state に保存
      setUser({
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        department: data.department,
      });
      console.log("[Auth] fetchUserProfile: セット完了", data.email);
    },
    [createProfileIfMissing]
  );

  useEffect(() => {
    console.log("[Auth] useEffect: 初期化開始");
    let mounted = true;

    // 起動時に「ログイン中かどうか」を確定させる初期化処理
    const INIT_TIMEOUT_MS = 15_000;

    const initializeAuth = async () => {
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        if (mounted) {
          console.warn("[Auth] init timeout: forcing loading=false");
          setLoading(false);
          setUser(null);
        }
      }, INIT_TIMEOUT_MS);

      try {
        if (mounted) setLoading(true);

        const { data, error } = await supabase.auth.getSession();
        console.log("[Auth] initializeAuth: getSession 完了", {
          hasSession: !!data.session,
          hasError: !!error,
        });

        if (timedOut) return; // タイムアウト後に遅れて返ってきても上書きしない
        if (error) throw error;

        const session = data.session;
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          if (mounted) setUser(null);
        }
      } catch (e) {
        console.error("[Auth] initializeAuth: エラー", e);
        if (mounted) setUser(null);
      } finally {
        clearTimeout(timeoutId);
        if (mounted) setLoading(false);
        console.log("[Auth] initializeAuth: 完了 loading=false");
      }
    };

    initializeAuth();

    const IGNORED_EVENTS: AuthChangeEvent[] = ["INITIAL_SESSION", "TOKEN_REFRESHED"];

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log(
          "[Auth] onAuthStateChange:",
          event,
          session?.user?.id ?? "no user"
        );

        // 無視するイベント（起動時やトークン更新など）
        if (IGNORED_EVENTS.includes(event)) return;

        // パスワードリセット中は別フロー
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

            // 必要になったら追加（基本は不要）
            // case "USER_UPDATED":
            //   if (session?.user) {
            //     if (mounted) setLoading(true);
            //     await fetchUserProfile(session.user);
            //   }
            //   break;

            default:
              console.log("[Auth] 未処理のイベント:", event);
          }
        } catch (e) {
          console.error("[Auth] onAuthStateChange: エラー", e);
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

  /** パスワードログイン */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  /**
   * サインアップ
   * - 確認メールONだと「その場でログイン状態にならない」ことがある
   * - だから user_metadata に display_name/department を入れておき、
   *   初回ログイン時に createProfileIfMissing が拾ってプロフィールを作れるようにする
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      department: string
    ) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            department,
          },
        },
      });

      if (error) return { data: null, error };
      return { data, error: null };
    },
    []
  );

  /** ログアウト */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  /** プロフィールを再取得（プロフィール更新後に呼び出す） */
  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      await fetchUserProfile(data.session.user);
    }
  }, [fetchUserProfile]);

  /** Contextに流す値（参照が安定するようuseMemo） */
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
