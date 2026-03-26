import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

type AuthError = { code?: string; message: string };

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません。",
  email_exists: "このメールアドレスは既に登録されています。ログインして下さい。",
  user_already_exists:
    "このメールアドレスは既に登録されています。ログインして下さい。",
  email_not_confirmed:
    "メールアドレスがまだ確認されていません。確認メールのリンクをご確認下さい。",
  weak_password:
    "パスワードが弱すぎます。もう少し複雑なパスワードを設定して下さい。",
  over_request_rate_limit: "リクエストが多すぎます。",
  over_email_send_rate_limit: "リクエストが多すぎます。",
};

function getAuthErrorMessage(error: AuthError): string {
  return (
    AUTH_ERROR_MESSAGES[error?.code ?? ""] ??
    error?.message ??
    "認証中にエラーが発生しました。"
  );
}

type UseLoginScreenManagementParams = {
  initialIsSignUp?: boolean;
};

export function useLoginScreenManagement({
  initialIsSignUp = false,
}: UseLoginScreenManagementParams) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [displayName, setDisplayName] = useState("");
  const [department, setDepartment] = useState("");

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleGoHome = useCallback(() => {
    router.replace("/home");
  }, [router]);

  const handleToggleMode = useCallback(() => {
    setIsSignUp((v) => !v);
    setError(null);
    setMessage(null);
  }, []);

  const createProfileAfterSignUp = useCallback(
    async (
      displayNameValue: string,
      departmentValue: string
    ): Promise<{ hasSession: boolean }> => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.warn("セッションの取得に失敗しました。", sessionError);
        return { hasSession: false };
      }
      const authUser = sessionData.session?.user;
      if (!authUser) return { hasSession: false };

      let departmentId: string | null = null;
      if (departmentValue) {
        const { data: departmentData, error: departmentError } = await supabase
          .from("departments")
          .select("id")
          .eq("name", departmentValue)
          .maybeSingle();
        if (departmentError) {
          console.warn("部署IDの解決に失敗しました。", departmentError);
        } else {
          departmentId = departmentData?.id ?? null;
        }
      }

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: authUser.id,
          email: authUser.email,
          display_name: displayNameValue,
          department_id: departmentId,
        },
        { onConflict: "id" }
      );
      if (upsertError)
        console.error("プロフィール作成に失敗しました。", upsertError);
      return { hasSession: true };
    },
    []
  );

  const handleSignUp = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data: signUpData, error: signUpError } = await signUp(
        email,
        password,
        displayName,
        department
      );
      if (signUpError) {
        setError(getAuthErrorMessage(signUpError));
        return;
      }
      if (
        signUpData?.user &&
        (!signUpData.user.identities || signUpData.user.identities.length === 0)
      ) {
        setError("このメールアドレスは既に登録されています。ログインしてください。");
        return;
      }
      const { hasSession } = await createProfileAfterSignUp(
        displayName,
        department
      );
      if (hasSession) {
        router.replace("/");
      } else {
        setMessage("確認メールを送信しました。メールを確認してください。");
      }
    } catch (e) {
      console.error("handleSignUp error:", e);
      setError("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [
    signUp,
    email,
    password,
    displayName,
    department,
    createProfileAfterSignUp,
    router,
  ]);

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(getAuthErrorMessage(signInError));
        return;
      }
      router.replace("/");
    } catch (e) {
      console.error("handleSignIn error:", e);
      setError("予期しないエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [signIn, email, password, router]);

  const handleSubmit = useCallback(() => {
    if (isSignUp) handleSignUp();
    else handleSignIn();
  }, [isSignUp, handleSignIn, handleSignUp]);

  return {
    state: {
      email,
      password,
      error,
      message,
      isLoading,
      isSignUp,
      displayName,
      department,
    },
    actions: {
      setEmail,
      setPassword,
      setDisplayName,
      setDepartment,
      handleGoHome,
      handleToggleMode,
      handleSubmit,
    },
  };
}

