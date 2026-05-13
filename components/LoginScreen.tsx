import { Lock, Mail } from "lucide-react-native";
import React, { memo } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DepartmentOption } from "../src/hooks/useLoginScreenManagement";
import { useLoginScreenManagement } from "../src/hooks/useLoginScreenManagement";
import { Input } from "./ui/input";

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
  departmentId: string;
  setDepartmentId: (v: string) => void;
  departmentOptions: DepartmentOption[];
  departmentsLoading: boolean;
  departmentsFetchError: string | null;
  onSubmit: () => void;
  onToggleMode: () => void;
  onForgotPassword: () => void;
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
  onSubmit,
  onToggleMode,
  onForgotPassword,
}: LoginFormProps) {
  const { width: windowWidth } = useWindowDimensions();
  const loginLogoCircle = Math.round(
    Math.min(220, Math.max(144, windowWidth * 0.42))
  );

  if (!isSignUp) {
    return (
      <View className="flex-1 items-center justify-center px-6 py-10 bg-[#0E47D6]">
        <View className="items-center mb-10">
          <View
            className="mb-6 overflow-hidden rounded-full bg-[#FF5A00] items-center justify-center"
            style={{ width: loginLogoCircle, height: loginLogoCircle }}
          >
            <Image
              source={require("../assets/images/logo.png")}
              style={{
                width: loginLogoCircle +10,
                height: loginLogoCircle +10,
              }}
              resizeMode="cover"
              accessibilityLabel="GENBA ロゴ"
            />
          </View>

          <Text className="text-white text-4xl font-bold tracking-wider">
            GENBA
          </Text>
          <Text className="text-white text-lg font-semibold mt-2">
            現場をつなぐ
          </Text>
        </View>

        <View className="w-full max-w-md">
          <View className="bg-white rounded-2xl px-4 py-1 mb-4 flex-row items-center">
            <Mail size={18} color="#9ca3af" style={{ marginRight: 12 }} />
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="メールアドレス"
              keyboardType="email-address"
              className="flex-1 border-0 bg-transparent"
            />
          </View>

          <View className="bg-white rounded-2xl px-4 py-1 mb-4 flex-row items-center">
            <Lock size={18} color="#9ca3af" style={{ marginRight: 12 }} />
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="パスワード"
              secureTextEntry
              className="flex-1 border-0 bg-transparent"
            />
          </View>

          {error && (
            <View className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          {message && (
            <View className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <Text className="text-green-700 text-sm">{message}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onSubmit}
            disabled={isLoading}
            className={`h-14 rounded-2xl items-center justify-center mb-6 ${
              isLoading ? "bg-orange-400" : "bg-[#FF5A00]"
            }`}
          >
            <Text className="text-white text-xl font-bold">
              {isLoading ? "ログイン中..." : "ログイン"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onForgotPassword} className="items-center mb-5">
            <Text className="text-white text-base font-medium underline">
              パスワードを忘れた場合
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 bg-[#0E47D6]">
      <Card className="w-full max-w-md">
        <View className="text-center mb-6">
          <Text className="text-2xl font-bold">GENBA</Text>
          <Text className="text-muted-foreground mt-2">
         
          </Text>
        </View>

        <View className="space-y-4">
          <View className="p-3 bg-muted rounded-md">
            <Text className="text-sm text-muted-foreground text-center">
             。
            </Text>
          </View>

          <View className="mt-4 items-center">
            <TouchableOpacity onPress={onToggleMode}>
              <Text className="text-primary underline">
                ログインに戻る
              </Text>
            </TouchableOpacity>
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
  const {
    email,
    password,
    error,
    message,
    isLoading,
    isSignUp,
    displayName,
    departmentId,
    departmentOptions,
    departmentsLoading,
    departmentsFetchError,
  } = state;
  const {
    setEmail,
    setPassword,
    setDisplayName,
    setDepartmentId,
    handleToggleMode,
    handleForgotPassword,
    handleSubmit,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background">
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
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          departmentOptions={departmentOptions}
          departmentsLoading={departmentsLoading}
          departmentsFetchError={departmentsFetchError}
          onSubmit={handleSubmit}
          onToggleMode={handleToggleMode}
          onForgotPassword={handleForgotPassword}
        />
      </View>
    </SafeAreaView>
  );
}