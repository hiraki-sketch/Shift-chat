// app/profile.tsx
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { ProfileSettings } from "../components/ProfileSettings";
import { useRequireAuth } from "../src/hooks/useRequireAuth";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const router = useRouter();
  const { status, user } = useRequireAuth("/login", 1500);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigate = useCallback(
    (page: string) => {
      const path = page === "index" ? "/" : `/${page}`;
      router.push(path as any);
    },
    [router]
  );

  const doLogout = useCallback(async () => {
    if (isLoggingOut) return; // ✅ 多重タップ防止

    setIsLoggingOut(true);
    try {
      // ✅ セッション確認（無いならログインへ）
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert("エラー", error.message ?? "ログアウトに失敗しました");
        return;
      }

      router.replace("/login"); // ✅ 戻るで戻れない
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, router]);

  const handleLogout = useCallback(() => {
    if (isLoggingOut) return;

    Alert.alert("ログアウト", "ログアウトしますか？", [
      { text: "キャンセル", style: "cancel" },
      { text: "ログアウト", style: "destructive", onPress: doLogout },
    ]);
  }, [doLogout, isLoggingOut]);

  // user オブジェクトをメモ化して、参照の変更を防ぐ（Hooksは早期リターンの前に呼ぶ必要がある）
  const memoizedUser = useMemo(
    () => {
      if (!user) return null;
      return {
        id: user.id,
        displayName: user.displayName ?? "未設定ユーザー",
        department: user.department ?? "未設定部署",
        email: user.email ?? "",
      };
    },
    [user]
  );

  // セッション確認中
  if (status === "checking") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 未ログイン時（useRequireAuth が /login にリダイレクトする）
  if (status === "unauthenticated" || !user || !memoizedUser) {
    return null;
  }

  return (
    <ProfileSettings
      user={memoizedUser}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
}
