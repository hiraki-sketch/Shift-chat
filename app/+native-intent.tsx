import type { NativeIntent } from "expo-router";

/**
 * Supabase は #access_token=... のフラグメントで戻す。
 * Expo Router のパス解決からは外し、トークン処理は Linking（AuthContext）側に任せる。
 */
export const redirectSystemPath: NonNullable<
  NativeIntent["redirectSystemPath"]
> = ({ path }) => {
  const i = path.indexOf("#");
  return i === -1 ? path : path.slice(0, i);
};
