export function toJapaneseErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string" &&
    (error as { message: string }).message.trim().length > 0
  ) {
    const raw = (error as { message: string }).message.toLowerCase();
    if (raw.includes("row-level security")) return "アクセス権限がありません。";
    if (raw.includes("permission denied")) return "アクセス権限がありません。";
    if (raw.includes("network")) return "ネットワークエラーが発生しました。";
    if (raw.includes("timeout")) return "通信がタイムアウトしました。";
  }
  return fallback;
}
