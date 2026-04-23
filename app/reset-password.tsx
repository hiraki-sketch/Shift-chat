import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPasswordManagement } from "@/src/hooks/useResetPasswordManagement";
import { ChevronLeft } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen() {
  const { state, actions } = useResetPasswordManagement();
  const { password, password2, message, error, ready, loading } = state;
  const { setPassword, setPassword2, handleSubmit, handleGoBackToLogin } = actions;

  return (
    <SafeAreaView className="flex-1 bg-[#0E47D6]">
      <View className="flex-1 justify-center p-5 bg-[#0E47D6]">
        <View className="mb-4">
          <Button
            variant="outline"
            onPress={handleGoBackToLogin}
            className="self-start h-10 px-3 rounded-full border-white/50"
          >
            <View className="flex-row items-center">
              <ChevronLeft size={18} color="#ffffff" />
              <Text className="text-white text-sm font-medium ml-1">
                ログインへ戻る
              </Text>
            </View>
          </Button>
        </View>

        <View className="bg-white rounded-2xl p-5 border border-white/20">
          <Text className="text-xl font-bold text-slate-900 mb-3">
            パスワード再設定
          </Text>

          {!ready && (
            <Text className="text-slate-700 mb-3">
              メールのリンクから開いてください（認証未検出）。
            </Text>
          )}

          {message && (
            <View className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
              <Text className="text-green-700 text-sm">{message}</Text>
            </View>
          )}
          {error && (
            <View className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          <View className="mb-3">
            <Label>新しいパスワード</Label>
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder="8文字以上"
            />
          </View>

          <View className="mb-4">
            <Label>新しいパスワード（確認）</Label>
            <Input
              value={password2}
              onChangeText={setPassword2}
              secureTextEntry
              autoCapitalize="none"
              placeholder="同じパスワードを入力"
            />
          </View>

          <Button
            onPress={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "更新中..." : "更新する"}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
