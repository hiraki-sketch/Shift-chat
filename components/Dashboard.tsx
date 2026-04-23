// components/Dashboard.tsx
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBreakpoint } from "../hooks/useResponsive";
import { useDashboardManagement } from "../src/hooks/useDashboardManagement";
import { Shift, User } from "../types";
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  Bell,
  FileText,
  MessageSquare,
  Search,
  Settings,
} from "./ui/icons";

// LinearGradient を className 対応にする
cssInterop(LinearGradient, { className: "style" });
const G = LinearGradient;

type DashboardProps = {
  user: User;
  selectedShift: Shift;
  onShiftChange: (shift: Shift) => void;
  onNavigate: (page: string) => void;
};

export function Dashboard({
  user,
  selectedShift,
  onShiftChange,
  onNavigate,
}: DashboardProps) {
  const { data, utils, query } = useDashboardManagement(user);
  const { shifts, unreadIncidents, recentAnnouncements } = data;
  const { sevDot } = utils;
  const { isPending, isError, error, refetch } = query;
  const { bp } = useBreakpoint();
  const narrow = bp === "sm";

  return (
    <SafeAreaView className="flex-1">
      <G
        colors={["#f8fafc", "#eef2ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-10 gap-6"
      >
        {/* Header */}
        <G
          colors={["#2563eb", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl border border-blue-500"
        >
          <View className="px-5 py-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-semibold text-white">GENBA</Text>
                <Text className="text-base text-blue-100">
                  {user.displayName} - {user.department}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => onNavigate("search")}
                  className="p-2 rounded-xl bg-white/20"
                >
                  <Search size={22} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onNavigate("profile")}
                  className="p-2 rounded-xl bg-white/20"
                >
                  <Settings size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </G>

        {/* 勤務帯選択 */}
        <G
          colors={["#10b981", "#0d9488"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl p-4 shadow-lg"
        >
          <Text className="text-xl font-semibold mb-1 text-white">現在の勤務帯</Text>
          <Text className="text-base text-emerald-100 mb-4">勤務帯を選択してください</Text>
          <View className="flex-row gap-3">
            {shifts.map((shift) => {
              const active = selectedShift === shift;
              return (
                <Button
                  key={shift}
                  variant={active ? "default" : "outline"}
                  size="md"
                  onPress={() => onShiftChange(shift)}
                  className={`flex-1 ${active ? "bg-blue-500 border-blue-500" : "bg-white/20 border-white"}`}
                >
                  {shift}
                </Button>
              );
            })}
          </View>
        </G>

        {!user.departmentId && (
          <View className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Text className="text-sm text-amber-900">
              プロフィールに部署が設定されていないため、未読の異常報告と最新の部署連絡は表示されません。
            </Text>
          </View>
        )}

        {/* 未読の異常報告 / 最新の部署連絡 → 最大2列 */}
        <ResponsiveGrid maxCols={{ sm:1, md:2, lg:2, xl:2, "2xl":2 }}>
          {/* 未読の異常報告 */}
          <G
            colors={["#fef2f2", "#ffedd5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-4 border border-red-200 shadow-lg"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-red-800">直近の異常報告</Text>
              <AlertTriangle size={18} color="#dc2626" />
            </View>
            <View className="gap-3">
              {isPending && (
                <View className="py-6 items-center justify-center">
                  <ActivityIndicator size="small" color="#dc2626" />
                  <Text className="text-xs text-gray-600 mt-2">読み込み中…</Text>
                </View>
              )}
              {isError && (
                <View className="py-3 px-2">
                  <Text className="text-sm text-red-700">
                    {error instanceof Error ? error.message : "読み込みに失敗しました"}
                  </Text>
                  <Pressable onPress={() => refetch()} className="mt-2 self-start">
                    <Text className="text-sm text-red-800 font-semibold underline">再試行</Text>
                  </Pressable>
                </View>
              )}
              {!isPending && !isError && (
                <>
                  {unreadIncidents.map((incident) => {
                    const sev = incident.severity.toLowerCase();
                    return (
                      <View
                        key={incident.id}
                        className="flex-row items-center justify-between p-3 rounded-xl bg-white/80 border border-red-100"
                      >
                        <View className="flex-row items-center gap-3 flex-1">
                          <View className={`w-3 h-3 rounded-full ${sevDot(incident.severity)}`} />
                          <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-800">{incident.title}</Text>
                            <Text className="text-xs text-gray-600">
                              {incident.shift} · {incident.time}
                            </Text>
                          </View>
                        </View>
                        <View
                          className={`px-2 py-1 rounded-md ${
                            sev === "high"
                              ? "bg-red-100"
                              : sev === "medium"
                                ? "bg-yellow-100"
                                : sev === "low"
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              sev === "high"
                                ? "text-red-800"
                                : sev === "medium"
                                  ? "text-yellow-800"
                                  : sev === "low"
                                    ? "text-green-800"
                                    : "text-gray-800"
                            }`}
                          >
                            {incident.severity}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="md"
                    onPress={() => onNavigate("incident-report")}
                    className="bg-white border-red-300"
                  >
                    すべて見る
                  </Button>
                </>
              )}
            </View>
          </G>

          {/* 最新の部署連絡 */}
          <G
            colors={["#eff6ff", "#e0e7ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-4 border border-blue-200 shadow-lg"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-blue-800">最新の部署連絡</Text>
              <Bell size={18} color="#2563eb" />
            </View>
            <View className="gap-3">
              {isPending && (
                <View className="py-6 items-center justify-center">
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text className="text-xs text-gray-600 mt-2">読み込み中…</Text>
                </View>
              )}
              {isError && (
                <View className="py-3 px-2">
                  <Text className="text-sm text-red-700">
                    {error instanceof Error ? error.message : "読み込みに失敗しました"}
                  </Text>
                  <Pressable onPress={() => refetch()} className="mt-2 self-start">
                    <Text className="text-sm text-red-800 font-semibold underline">再試行</Text>
                  </Pressable>
                </View>
              )}
              {!isPending && !isError && (
                <>
                  {recentAnnouncements.map((a) => (
                    <View key={a.id} className="p-3 rounded-xl bg-white/80 border border-blue-100">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-medium text-gray-800">{a.title}</Text>
                        {a.pinned && (
                          <View className="px-2 py-1 rounded-md bg-blue-100 border border-blue-300">
                            <Text className="text-xs text-blue-800 font-medium">ピン留め</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-gray-600 mt-1">{a.time}</Text>
                    </View>
                  ))}
                  <Button
                    variant="outline"
                    size="md"
                    onPress={() => onNavigate("department-chat")}
                    className="bg-white border-blue-300"
                  >
                    部署連絡を見る
                  </Button>
                </>
              )}
            </View>
          </G>
        </ResponsiveGrid>

        {/* クイックアクション → 1/2/3/4列 */}
        <G
          colors={["#faf5ff", "#ffe4e6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-4 border border-purple-200 shadow-lg"
        >
          <Text className="text-xl font-semibold mb-4 text-purple-800">クイックアクション</Text>
          <ResponsiveGrid pad={0} maxCols={{ sm:1, md:2, lg:3, xl:4, "2xl":4 }}>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-red-200 rounded-xl"
              onPress={() => onNavigate("incident-report")}
            >
              <AlertTriangle size={32} color="#ef4444" />
              <Text className="text-lg mt-2 text-red-600 font-medium">異常報告</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-blue-200 rounded-xl"
              onPress={() => onNavigate("chat-threads")}
            >
              <MessageSquare size={32} color="#3b82f6" />
              <Text className="text-lg mt-2 text-blue-600 font-medium">チャット</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-green-200 rounded-xl"
              onPress={() => onNavigate("search")}
            >
              <Search size={32} color="#22c55e" />
              <Text className="text-lg mt-2 text-green-600 font-medium">検索</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-purple-200 rounded-xl"
            >
              <FileText size={32} color="#a855f7" />
              <Text className="text-lg mt-2 text-purple-600 font-medium">COMMING SOON</Text>
            </TouchableOpacity>
          </ResponsiveGrid>
        </G>

        {/* 勤務管理 → sm:1 / md+:3 */}
        <G
          colors={["#fffbeb", "#ffedd5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-4 border border-amber-200 shadow-lg"
        >
          <Text className="text-xl font-semibold mb-4 text-amber-800">勤務管理</Text>
          <ResponsiveGrid pad={0} maxCols={{ sm:1, md:3, lg:3, xl:3, "2xl":3 }}>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-indigo-200 rounded-xl"
              onPress={() => onNavigate("work-schedule")}
            >
              <Text className="text-2xl">📅</Text>
              <Text className="text-lg mt-2 text-indigo-600 font-medium">勤務表</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-green-200 rounded-xl"
              onPress={() => onNavigate("attendance")}
            >
              <Text className="text-2xl">⏰</Text>
              <Text className="text-lg mt-2 text-green-600 font-medium">出勤管理</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-28 items-center justify-center bg-white border border-orange-200 rounded-xl"
              onPress={() => onNavigate("vacation")}
            >
              <Text className="text-2xl">✈️</Text>
              <Text className="text-lg mt-2 text-orange-600 font-medium">有給休暇</Text>
            </TouchableOpacity>
          </ResponsiveGrid>
        </G>

        {/* アラート */}
        <G
          colors={["#cffafe", "#dbeafe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-2xl p-4 border border-cyan-200 shadow-lg"
        >
          <View 
          style={{
            flexDirection: narrow ? "column" : "row",
            alignItems: narrow ? "flex-start" : "center",
            gap: 12,
            width: "100%",
          }}
          >
          <View style={{flexShrink: 0}}>
          <Bell size={22} color="#0891b2" />
          </View>

          <Text 
            className="text-base text-cyan-800 font-medium"
            style={{ flex: 1, minWidth: 0, lineHeight: 20, marginTop: narrow ? 4 : 0 }}
          >
            現在 {selectedShift} 勤務中です。新しい異常報告や重要な連絡がある場合は通知されます。
          </Text>
          </View>
        </G>
      </ScrollView>
    </G>
    </SafeAreaView>
  );
}