import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { DepartmentChat } from "../components/DepartmentChat";
import { useRequireAuth } from "../src/hooks/useRequireAuth";
import { User } from "../types";

export default function DepartmentChatPage() {
  const router = useRouter();
  const { status, user } = useRequireAuth("/login", 1500);

  if (status === "checking") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }
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

  const appUser: User = {
    id: user!.id,
    displayName: user!.displayName ?? "未設定ユーザー",
    departmentId: user!.departmentId ?? "",
    departmentName: user!.departmentName ?? user!.department ?? "未設定部署",
    department: user!.department ?? "未設定部署",
    email: user!.email ?? "",
    role: user!.role,
  };

  const handleNavigate = (page: string) => {
    const path = page === "index" ? "/" : `/${page}`;
    router.push(path as any);
  };

  return (
    <DepartmentChat user={appUser} onNavigate={handleNavigate} />
  );
}
