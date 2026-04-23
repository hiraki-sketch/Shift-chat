import React, { memo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { DepartmentOption } from "../src/hooks/useLoginScreenManagement";
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
  displayName,
  setDisplayName,
  departmentId,
  setDepartmentId,
  departmentOptions,
  departmentsLoading,
  departmentsFetchError,
  onSubmit,
  onToggleMode,
  onForgotPassword,
}: LoginFormProps) {
  const [departmentPickerOpen, setDepartmentPickerOpen] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const selectedDepartmentLabel =
    departmentOptions.find((d) => d.id === departmentId)?.name ?? "";
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
            <Text className="text-gray-400 mr-3 text-base">✉</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="メールアドレス"
              keyboardType="email-address"
              className="flex-1 border-0 bg-transparent"
            />
          </View>

          <View className="bg-white rounded-2xl px-4 py-1 mb-4 flex-row items-center">
            <Text className="text-gray-400 mr-3 text-base">🔒</Text>
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

          <TouchableOpacity onPress={onToggleMode} className="items-center">
            <Text className="text-white text-base underline">
              アカウントを作成する
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
            アカウントを作成してください
          </Text>
        </View>

        <View className="space-y-4">
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
            <TouchableOpacity
              onPress={() => setDepartmentPickerOpen(true)}
              disabled={departmentsLoading || !!departmentsFetchError}
              className="border border-border rounded-md px-3 py-3 bg-background"
              activeOpacity={0.7}
            >
              {departmentsLoading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" />
                  <Text className="text-muted-foreground">読み込み中...</Text>
                </View>
              ) : departmentsFetchError ? (
                <Text className="text-destructive text-sm">
                  {departmentsFetchError}
                </Text>
              ) : (
                <Text
                  className={
                    selectedDepartmentLabel
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {selectedDepartmentLabel || "タップして部署を選択"}
                </Text>
              )}
            </TouchableOpacity>
            <Modal
              visible={departmentPickerOpen}
              animationType="fade"
              transparent
              onRequestClose={() => setDepartmentPickerOpen(false)}
            >
              <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={() => setDepartmentPickerOpen(false)}
              >
                <Pressable
                  className="bg-card rounded-t-2xl border border-border max-h-[70%] pb-8"
                  onPress={(e) => e.stopPropagation()}
                >
                  <View className="flex-row justify-between items-center px-4 py-3 border-b border-border">
                    <Text className="text-lg font-semibold">部署を選択</Text>
                    <TouchableOpacity onPress={() => setDepartmentPickerOpen(false)}>
                      <Text className="text-primary font-medium">閉じる</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    className="px-2 py-2"
                  >
                    {departmentOptions.length === 0 ? (
                      <Text className="text-muted-foreground text-center py-6 px-4">
                        登録されている部署がありません。管理者に連絡してください。
                      </Text>
                    ) : (
                      departmentOptions.map((d) => (
                        <TouchableOpacity
                          key={d.id}
                          onPress={() => {
                            setDepartmentId(d.id);
                            setDepartmentPickerOpen(false);
                          }}
                          className={`py-3 px-4 rounded-lg mb-1 ${
                            departmentId === d.id ? "bg-primary/10" : ""
                          }`}
                        >
                          <Text className="text-base text-foreground">
                            {d.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>
          </View>

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
            {isLoading ? "処理中..." : "アカウント作成"}
          </Button>

          <View className="mt-3 items-center">
            <TouchableOpacity onPress={onForgotPassword}>
              <Text className="text-primary underline">
                パスワードを忘れた場合
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 items-center">
            <TouchableOpacity onPress={onToggleMode}>
              <Text className="text-primary underline">
                ログインに戻る
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 p-3 bg-muted rounded-md">
            <Text className="text-sm text-muted-foreground text-center">
              <Text className="font-bold">テスト用:</Text>{" "}
              自分で設定したメールアドレスでログインして下さい。
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