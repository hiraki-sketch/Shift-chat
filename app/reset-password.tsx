import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setError(null);
        setMessage("新しいパスワードを設定してください。");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async () => {
    setError(null);
    setMessage(null);

    if (!ready) {
      setError("認証が確認できません。パスワード再設定メールのリンクから開いてください。");
      return;
    }

    if (!password || password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }

    if (password !== password2) {
      setError("パスワードが一致しません。");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message ?? "更新に失敗しました");
        return;
      }

      setMessage("パスワードを更新しました。ログインしてください。");

      await supabase.auth.signOut();

      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center p-5">
        <Text className="text-xl font-bold text-foreground mb-3">
          パスワード再設定
        </Text>

        {!ready && (
          <Text className="text-foreground mb-3">
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
          onPress={onSubmit}
          disabled={loading || !ready}
          className="w-full"
        >
          {loading ? "更新中..." : "更新する"}
        </Button>
      </View>
    </SafeAreaView>
  );
}
