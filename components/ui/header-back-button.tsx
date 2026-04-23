import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "./button";

type HeaderBackButtonProps = {
  onPress: () => void;
  /** lucide の線色（ヘッダー背景に合わせて指定） */
  iconColor?: string;
  className?: string;
  accessibilityLabel?: string;
};

/**
 * 画面ヘッダー左の「戻る」を統一（ChevronLeft + ghost Button）
 */
export function HeaderBackButton({
  onPress,
  iconColor = "#64748b",
  className = "p-2 rounded-xl min-h-10 min-w-10",
  accessibilityLabel = "戻る",
}: HeaderBackButtonProps) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      className={className}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <View className="items-center justify-center">
        <ChevronLeft size={22} color={iconColor} strokeWidth={2.25} />
      </View>
    </Button>
  );
}
