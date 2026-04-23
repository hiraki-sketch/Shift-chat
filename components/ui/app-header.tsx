import { ReactNode } from "react";
import { Text, View } from "react-native";

import { HeaderBackButton } from "./header-back-button";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  variant?: "default" | "emerald";
};

export function AppHeader({
  title,
  subtitle,
  onBack,
  rightSlot,
  variant = "default",
}: AppHeaderProps) {
  const isEmerald = variant === "emerald";
  const rootClassName = isEmerald
    ? "bg-emerald-500 border-b border-emerald-700 shadow-sm"
    : "bg-card border-b border-border";
  const titleClassName = isEmerald
    ? "text-2xl font-bold text-white"
    : "text-xl font-semibold text-foreground";
  const subtitleClassName = isEmerald ? "text-sm text-emerald-100" : "text-sm text-muted-foreground";
  const iconColor = isEmerald ? "#ffffff" : "#64748b";
  const backClassName = isEmerald
    ? "p-2 rounded-xl min-h-10 min-w-10 shrink-0"
    : "p-2 rounded-xl min-h-10 min-w-10";

  return (
    <View className={rootClassName}>
      <View className="px-4">
        <View className="flex-row items-center justify-between h-16 min-w-0">
          <View className="flex-row items-center flex-1 pr-3 min-w-0">
            {onBack ? (
              <HeaderBackButton onPress={onBack} iconColor={iconColor} className={backClassName} />
            ) : null}
            <View className={`${onBack ? "ml-3" : ""} flex-1 min-w-0`}>
              <Text className={titleClassName} numberOfLines={1} ellipsizeMode="tail">
                {title}
              </Text>
              {subtitle ? (
                <Text className={subtitleClassName} numberOfLines={2} ellipsizeMode="tail">
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          {rightSlot ? <View className="shrink-0">{rightSlot}</View> : null}
        </View>
      </View>
    </View>
  );
}
