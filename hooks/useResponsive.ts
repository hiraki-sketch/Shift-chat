// hooks/useResponsive.ts
import { useWindowDimensions, PixelRatio } from "react-native";

/** 端末幅からブレークポイント名・列数を決定 */
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  // 好みで調整可（工場タブレットも考慮）
  const bp =
    width >= 1440 ? "2xl" :
    width >= 1200 ? "xl"  :
    width >= 900  ? "lg"  :
    width >= 600  ? "md"  : "sm";

  return { width, bp };
}

/** 列数を段階的に返す（セクションごとに別ルールが持てる） */
export function useCols(map?: Partial<Record<"sm"|"md"|"lg"|"xl"|"2xl", number>>) {
  const { width, bp } = useBreakpoint();
  const defaults = { sm: 1, md: 2, lg: 2, xl: 3, "2xl": 4 };
  const merged = { ...defaults, ...map };
  const cols = merged[bp as keyof typeof merged] ?? 1;
  return { width, bp, cols };
}

/** gap/左右paddingを考慮して “ピクセル正確なカード幅” を算出 */
export function useGridWidth(cols: number, opts?: { gap?: number; pad?: number }) {
  const { width } = useWindowDimensions();
  const gap = opts?.gap ?? 24;
  const pad = opts?.pad ?? 20;
  const inner = width - pad * 2;
  const itemWidth = (inner - gap * (cols - 1)) / cols;

  // サブピクセルでにじむ端末向けに丸め（必要なら外してOK）
  const scale = PixelRatio.get();
  const rounded = Math.floor(itemWidth * scale) / scale;

  return { itemWidth: rounded, gap, pad, containerWidth: inner };
}
