import Constants from "expo-constants";
import * as Linking from "expo-linking";

import { supabase } from "./client.native";

function resolveScheme(): string | undefined {
  const schemeConfig = Constants.expoConfig?.scheme;
  if (typeof schemeConfig === "string") return schemeConfig;
  if (Array.isArray(schemeConfig)) return schemeConfig[0];
  return undefined;
}

/**
 * サインアップ確認メールの emailRedirectTo。
 * Additional Redirect URLs に例: genba://auth を登録。
 */
export function getSignUpEmailRedirectTo(): string {
  const scheme = resolveScheme();
  if (scheme) return `${scheme}://auth`;
  return Linking.createURL("auth");
}

/**
 * パスワード再設定メールの redirectTo。
 * Additional Redirect URLs に例: genba://reset-password を登録。
 */
export function getPasswordRecoveryRedirectTo(): string {
  const scheme = resolveScheme();
  if (scheme) return `${scheme}://reset-password`;
  return Linking.createURL("reset-password");
}

export type AuthDeepLinkResult = {
  applied: boolean;
  /** URL フラグメントの type=recovery（パスワード再設定メール経由） */
  isPasswordRecovery: boolean;
};

/**
 * genba://auth または genba://reset-password などに付いた
 * #access_token=... からセッションを保存する。
 * client.native の detectSessionInUrl: false のため、ここで明示的に処理する。
 */
export async function tryConsumeAuthDeepLinkUrl(
  url: string
): Promise<AuthDeepLinkResult> {
  const empty: AuthDeepLinkResult = { applied: false, isPasswordRecovery: false };
  try {
    const parsed = new URL(url);
    const fromSearch = new URLSearchParams(
      parsed.search.startsWith("?") ? parsed.search.slice(1) : parsed.search
    );
    const fromHash = parsed.hash
      ? new URLSearchParams(parsed.hash.replace(/^#/, ""))
      : new URLSearchParams();

    const type = fromHash.get("type") ?? fromSearch.get("type") ?? "";
    const isPasswordRecovery = type === "recovery";

    const access_token =
      fromHash.get("access_token") ?? fromSearch.get("access_token") ?? "";
    const refresh_token =
      fromHash.get("refresh_token") ?? fromSearch.get("refresh_token") ?? "";

    if (!access_token || !refresh_token) {
      return empty;
    }

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) {
      console.warn("[Auth] Deep Link からの setSession に失敗", error);
      return empty;
    }
    return { applied: true, isPasswordRecovery };
  } catch (e) {
    console.warn("[Auth] Deep Link URL の解析に失敗", e);
    return empty;
  }
}
