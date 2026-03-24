import React, { memo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginScreenManagement } from "../src/hooks/useLoginScreenManagement";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


/** =========================
 * UI Components (minimal)
 * - 1ファイルのまま、画面の中で使う部品だけ関数化
 * - memoは「Cardだけ」残す（頻繁に変わらない枠なので害が少ない）
 * ========================= */

/**
 * Card（最低限memo）
 * - レイアウト枠なので、入力中に毎回作り直す必要が薄い
 * - memoしても副作用が起きにくい（propsがchildren中心）
 */
const Card = memo(function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <View className={["bg-card rounded-2xl border border-border p-6", className].join(" ")}>{children}</View>;
});

/** ログイン画面ヘッダー（戻る + ロゴ） */
function LoginScreenHeader({ onGoHome }: { onGoHome: () => void }) {
  return (
    <View className="bg-card border-b border-border shadow-sm">
      <View className="max-w-md mx-auto px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Button
            variant="ghost"
            onPress={onGoHome}
            className="flex-row items-center gap-2 px-3 py-2 rounded-md"
          >
            <Text>←</Text>
            <Text>戻る</Text>
          </Button>
          <View className="flex-row items-center space-x-2">
            <View className="w-6 h-6 bg-primary rounded-md items-center justify-center">
              <Text className="text-primary-foreground text-sm">F</Text>
            </View>
            <Text className="text-sm font-medium text-foreground">CHAT-MANAGE</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** ログイン/サインアップフォーム欄 */
type LoginFormProps = {
  isSignUp: boolean;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
};

function LoginForm({
  isSignUp,
  isLoading,
  error,
  message,
  email,
  setEmail,
  password,
  setPassword,
  displayName,
  setDisplayName,
  department,
  setDepartment,
  onSubmit,
  onToggleMode,
}: LoginFormProps) {
  return (
    <View className="flex items-center justify-center p-4 pt-8">
      <Card className="w-full max-w-md">
        <View className="text-center mb-6">
          <Text className="text-2xl font-bold">SHIFT-CHAT</Text>
          <Text className="text-muted-foreground mt-2">
            {isSignUp ? "アカウントを作成してください" : "ログインしてください"}
          </Text>
        </View>

        <View className="space-y-4">
          {isSignUp && (
            <>
              <View className="space-y-2">
                <Label>表示名</Label>
                <Input
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="平木友隆"
                />
              </View>
              <View className="space-y-2">
                <Label>部署</Label>
                <Input
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="例: 製造部、品質管理部、保守部など"
                />
              </View>
            </>
          )}

          <View className="space-y-2">
            <Label>メールアドレス</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="example@company.com"
            />
          </View>
          <View className="space-y-2">
            <Label>パスワード</Label>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          {error && (
            <View className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}
          {message && (
            <View className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <Text className="text-green-700 text-sm">{message}</Text>
            </View>
          )}

          <Button onPress={onSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? "処理中..." : isSignUp ? "アカウント作成" : "ログイン"}
          </Button>

          <View className="mt-4 items-center">
            <TouchableOpacity onPress={onToggleMode}>
              <Text className="text-primary underline">
                {isSignUp ? "ログインに戻る" : "アカウントを作成する"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 p-3 bg-muted rounded-md">
            <Text className="text-sm text-muted-foreground text-center">
              <Text className="font-bold">テスト用:</Text> 自分で設定したメールアドレスでログインして下さい。
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

/** =========================
 * Screen
 * ========================= */

type LoginScreenProps = {
  // `/signup` などから開いたときに、最初からサインアップ画面にする
  initialIsSignUp?: boolean;
  // 互換用（既存呼び出し元が渡している可能性があるため）
  onPressLogin?: () => void;
};

export function LoginScreen({ initialIsSignUp = false }: LoginScreenProps) {
  const { state, actions } = useLoginScreenManagement({ initialIsSignUp });
  const { email, password, error, message, isLoading, isSignUp, displayName, department } = state;
  const {
    setEmail,
    setPassword,
    setDisplayName,
    setDepartment,
    handleGoHome,
    handleToggleMode,
    handleSubmit,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-background">
        <LoginScreenHeader onGoHome={handleGoHome} />
        <LoginForm
          isSignUp={isSignUp}
          isLoading={isLoading}
          error={error}
          message={message}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          displayName={displayName}
          setDisplayName={setDisplayName}
          department={department}
          setDepartment={setDepartment}
          onSubmit={handleSubmit}
          onToggleMode={handleToggleMode}
        />
      </ScrollView>
    </SafeAreaView>
  );
}