import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useResetPasswordManagement() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled || !sessionData.session) return;
      setReady(true);
      setError(null);
      setMessage("新しいパスワードを設定してください。");
    })();

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setError(null);
        setMessage("新しいパスワードを設定してください。");
      }
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = useCallback(async () => {
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
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message ?? "更新に失敗しました");
        return;
      }

      setMessage("パスワードを更新しました。ログインしてください。");
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (e) {
      console.error("パスワード更新時の通信エラー:", e);
      setError("通信エラーが発生しました。ネットワークを確認して再試行してください。");
    } finally {
      setLoading(false);
    }
  }, [password, password2, ready, router]);

  const handleGoBackToLogin = useCallback(() => {
    router.replace("/login");
  }, [router]);

  return {
    state: {
      password,
      password2,
      message,
      error,
      ready,
      loading,
    },
    actions: {
      setPassword,
      setPassword2,
      handleSubmit,
      handleGoBackToLogin,
    },
  };
}
