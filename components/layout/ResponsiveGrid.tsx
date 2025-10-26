// components/layout/ResponsiveGrid.tsx
import { useCols } from "@/hooks/useResponsive";
import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, PixelRatio, View, ViewProps, ViewStyle } from "react-native";

/** children を cols 個に自動整列（親の実寸幅で計算） */
export function ResponsiveGrid({
  children,
  maxCols,
  gap = 24,
  pad = 0,              // 親（セクション/ScrollView）に余白がある前提なので0をデフォ
  itemStyle,
  style,
  ...rest
}: ViewProps & {
  maxCols?: Partial<Record<"sm"|"md"|"lg"|"xl"|"2xl", number>>;
  gap?: number;
  pad?: number;
  itemStyle?: ViewStyle; // 各アイテムに一括スタイル（minHeight等に便利）
}) {
  const { cols } = useCols(maxCols);
  const [containerW, setContainerW] = useState<number | null>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerW(e.nativeEvent.layout.width);
  }, []);

  // 親幅が未取得の初期描画は 1列で一旦表示 → 次フレームで幅確定
  const inner = Math.max(0, (containerW ?? 0) - pad * 2);
  const rawItemW = cols > 0 ? (inner - gap * (cols - 1)) / cols : 0;

  // サブピクセル丸め（にじみ・1px段差対策）
  const scale = PixelRatio.get();
  const itemWidth = containerW ? Math.floor(rawItemW * scale) / scale : undefined;

  const items = React.Children.toArray(children)
    .filter(Boolean)
    .map((child, i) => (
      <View key={i} style={[{ width: itemWidth ?? "100%" }, itemStyle]}>
        {child}
      </View>
    ));

  return (
    <View
      {...rest}
      onLayout={onLayout}
      style={[
        { flexDirection: "row", flexWrap: "wrap", gap, paddingHorizontal: pad },
        style,
      ]}
    >
      {items}
    </View>
  );
}
