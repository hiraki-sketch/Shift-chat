import { useAuth } from "@/contexts/AuthContext";
import { getPasswordRecoveryRedirectTo } from "@/lib/supabase/authRedirect";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export type DepartmentOption = { id: string; name: string };

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
  const [departmentId, setDepartmentId] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState<DepartmentOption[]>(
    []
  );
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsFetchError, setDepartmentsFetchError] = useState<
    string | null
  >(null);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleGoHome = useCallback(() => {
    router.replace("/home");
  }, [router]);

  const handleToggleMode = useCallback(() => {
    setIsSignUp((v) => !v);
    setError(null);
    setMessage(null);
    setDepartmentId("");
  }, []);

  useEffect(() => {
    if (!isSignUp) return;
    let cancelled = false;
    setDepartmentsLoading(true);
    setDepartmentsFetchError(null);
    void (async () => {
      const { data, error } = await supabase
        .from("signup_departments")
        .select("id, name")
        .order("name", { ascending: true });
      if (cancelled) return;
      setDepartmentsLoading(false);
      if (error) {
        console.warn("部署一覧の取得に失敗", error);
        setDepartmentsFetchError(
          "部署一覧を取得できませんでした。通信環境を確認してください。"
        );
        setDepartmentOptions([]);
        return;
      }
      setDepartmentOptions((data ?? []) as DepartmentOption[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSignUp]);

  const handleForgotPassword = useCallback(async () => {
    setError(null);
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("再設定用のリンクを送るには、メールアドレスを入力してください。");
      return;
    }
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmed,
        { redirectTo: getPasswordRecoveryRedirectTo() }
      );
      if (resetError) {
        setError(getAuthErrorMessage(resetError as AuthError));
        return;
      }
      setMessage(
        "パスワード再設定用のリンクをメールで送信しました。届いたメールから開いてください。"
      );
    } catch (e) {
      console.error("resetPasswordForEmail error:", e);
      setError("送信に失敗しました。ネットワークを確認して再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const createProfileAfterSignUp = useCallback(
    async (
      displayNameValue: string,
      departmentIdValue: string
    ): Promise<{ hasSession: boolean }> => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        console.warn("セッションの取得に失敗しました。", sessionError);
        return { hasSession: false };
      }
      const authUser = sessionData.session?.user;
      if (!authUser) return { hasSession: false };

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: authUser.id,
          email: authUser.email,
          display_name: displayNameValue,
          department_id: departmentIdValue || null,
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
      if (!departmentId.trim()) {
        setError("部署を選択してください。");
        return;
      }
      const { data: signUpData, error: signUpError } = await signUp(
        email,
        password,
        displayName,
        departmentId
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
        departmentId
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
    departmentId,
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
      departmentId,
      departmentOptions,
      departmentsLoading,
      departmentsFetchError,
    },
    actions: {
      setEmail,
      setPassword,
      setDisplayName,
      setDepartmentId,
      handleGoHome,
      handleToggleMode,
      handleForgotPassword,
      handleSubmit,
    },
  };
}

