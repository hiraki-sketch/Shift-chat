// app/index.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Dashboard } from "../components/Dashboard";
import { useRequireAuth } from "../src/hooks/useRequireAuth";
import { Shift, User } from "../types";


export default function IndexRoute() {
  const router = useRouter();
  const [shift, setShift] = useState<Shift>("1勤");

  // 認証必須 & 未ログインなら /login に飛ばす
  const { status, user } = useRequireAuth("/login", 1500);

  // ① セッション確認中
  if (status === "checking") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ② 未ログイン時：メッセージ表示（1.5秒後に login へ）
  if (status === "unauthenticated") {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-bold mb-2">ログインが必要です</Text>
        <Text className="text-base text-slate-600 text-center">
          ログイン画面へ移動しています…
        </Text>
        <ActivityIndicator size="large" className="mt-4" />
      </View>
    );
  }

  // ③ ここまで来たら user は必ず存在する前提で OK
  const appUser: User = {
    id: user!.id,
    displayName: user!.displayName ?? "未設定ユーザー",
    department: user!.department ?? "未設定部署",
    email: user!.email ?? "",
  };

  // ④ ホーム画面
  return (
    <Dashboard
      user={appUser}
      selectedShift={shift}
      onShiftChange={setShift}
      onNavigate={(page) => {
        console.log("Navigating to:", page);
        router.push(`/${page}`);
      }}
    />
  );
}
