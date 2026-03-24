import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "../types";
import { useAttendanceManagement } from "../src/hooks/useAttendanceManagement";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// user側の操作によって出勤管理を行う。
interface AttendanceManagementProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function AttendanceManagement({
  user,
  onNavigate,
}: AttendanceManagementProps) {
  const { state, data, utils, actions } = useAttendanceManagement(user);
  const { currentTime, todayStatus } = state;
  const { todayAttendance, recentAttendance } = data;
  const { formatTime, getStatusColor, getStatusText, calculateWorkTime } = utils;
  const { handleClockIn, handleClockOut, handleBreakStart, handleBreakEnd } = actions;

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="bg-card border-b border-border">
        <View className="px-5 py-4">
          <View className="flex-row items-center space-x-4">
            <Button variant="ghost" onPress={() => onNavigate("index")} className="p-2 rounded-xl">
              ←
            </Button>
            <View>
              <Text className="text-xl font-semibold text-muted-foreground">出勤管理</Text>
              <Text className="text-sm text-muted-foreground">
                {user.displayName} - {user.department}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-5 gap-6">
        <View className="flex-row flex-wrap gap-6">
          {/* 打刻パネル */}
          <View className="basis-full lg:basis-[48%] flex-1">
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold flex-row items-center ">
                  打刻
                </Text>
              </View>
              <View className="space-y-6">
                <View className="text-center space-y-6">
                  <Text className="text-4xl font-mono font-bold text-blue-600">
                    {formatTime(currentTime)}
                  </Text>
                  <Text className="text-lg text-muted-foreground">
                    {currentTime.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </Text>

                  <View className="space-y-3">
                    {todayStatus === "not_started" && (
                      <Button
                        onPress={handleClockIn}
                        variant="outline"
                        className="w-full h-12 bg-white"
                        >
                        <Text className="text-black font-semibold">▶️ 出勤打刻</Text>
                      </Button>
                    )}

                    {todayStatus === "working" && (
                      <View className="space-y-2">
                        <Button
                          onPress={handleBreakStart}
                          variant="outline"
                          className="w-full h-12 bg-white"
                        >
                          <Text className="text-black font-semibold">☕ 休憩開始</Text>
                        </Button>
                        <Button
                          onPress={handleClockOut}
                          variant="destructive"
                          className="w-full h-12"
                        >
                          ⏹️ 退勤
                        </Button>
                      </View>
                    )}

                    {todayStatus === "on_break" && (
                      <View className="space-y-2">
                        <View className="flex-row items-center gap-3 bg-muted rounded-2xl p-4">
                          <Text className="text-2xl text-muted-foreground">☕</Text>
                          <Text className="text-base text-muted-foreground">
                            現在休憩中です
                          </Text>
                        </View>
                        <Button
                          onPress={handleBreakEnd}
                          variant="outline"
                          className="w-full h-12 bg-white"
                        >
                          <Text className="text-black font-semibold">▶️ 休憩終了</Text>
                        </Button>
                      </View>
                    )}

                    {todayStatus === "finished" && (
                      <View className="flex-row items-center gap-3 bg-muted rounded-2xl p-4">
                        <Text className="text-base text-muted-foreground">
                          本日の勤務は終了しました。お疲れ様でした！
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Card>

            {/* 今日の出勤状況 */}
            <Card className="mt-6">
              <View className="mb-4">
                <Text className="text-lg font-semibold">今日の出勤状況</Text>
              </View>
              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground">勤務帯</Text>
                  <Badge variant="secondary">{todayAttendance.shift}</Badge>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground">出勤時刻</Text>
                  <Text className="text-sm font-medium text-muted-foreground">
                    {todayAttendance.clockIn || "未打刻"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground">退勤時刻</Text>
                  <Text className="text-sm font-medium text-muted-foreground">
                    {todayAttendance.clockOut || "未打刻"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground">状態</Text>
                  <Badge variant="secondary">
                    {getStatusText(todayAttendance.status || "present")}
                  </Badge>
                </View>
              </View>
            </Card>
          </View>

          {/* 出勤履歴 */}
          <View className="basis-full lg:basis-[48%] flex-1">
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold">最近の出勤履歴</Text>
              </View>
              <View className="space-y-4">
                {recentAttendance.map((record) => (
                  <View
                    key={record.id}
                    className="border rounded-lg p-4 bg-muted"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center space-x-2">
                        <Text className="font-medium">
                          {new Date(record.date).toLocaleDateString("ja-JP", {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                        </Text>
                        <Badge variant="secondary">{record.shift}</Badge>
                        <View className={`px-2 py-1 rounded-md ${getStatusColor(record.status)}`}>
                          <Text className="text-xs text-white font-medium">
                            {getStatusText(record.status)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="grid grid-cols-2 gap-4">
                      <View>
                        <Text className="text-gray-600 text-sm">出勤:</Text>
                        <Text className="ml-1 font-medium text-sm">{record.clockIn}</Text>
                      </View>
                      <View>
                        <Text className="text-gray-600 text-sm">退勤:</Text>
                        <Text className="ml-1 font-medium text-sm">{record.clockOut}</Text>
                      </View>
                      {record.breakStart && record.breakEnd && (
                        <>
                          <View>
                            <Text className="text-gray-600 text-sm">休憩:</Text>
                            <Text className="ml-1 font-medium text-sm">
                              {record.breakStart} - {record.breakEnd}
                            </Text>
                          </View>
                          <View>
                            <Text className="text-gray-600 text-sm">実働:</Text>
                            <Text className="ml-1 font-medium text-sm">
                              {calculateWorkTime(
                                record.clockIn!,
                                record.clockOut!,
                                record.breakStart,
                                record.breakEnd,
                              )}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>

                    {record.notes && (
                      <View className="mt-2">
                        <Text className="text-sm text-muted-foreground">
                          <Text className="font-medium">備考:</Text> {record.notes}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Card>
          </View>
        </View>

        {/* 月次統計 */}
        <Card>
          <View className="mb-4">
            <Text className="text-lg font-semibold">今月の統計</Text>
          </View>
          <View className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <View className="text-center p-4 bg-blue-50 rounded-lg">
              <Text className="text-2xl font-bold text-blue-600">20</Text>
              <Text className="text-sm text-muted-foreground">出勤日数</Text>
            </View>
            <View className="text-center p-4 bg-green-50 rounded-lg">
              <Text className="text-2xl font-bold text-green-600">2</Text>
              <Text className="text-sm text-muted-foreground">遅刻回数</Text>
            </View>
            <View className="text-center p-4 bg-yellow-50 rounded-lg">
              <Text className="text-2xl font-bold text-yellow-600">160</Text>
              <Text className="text-sm text-muted-foreground">総労働時間</Text>
            </View>
            <View className="text-center p-4 bg-purple-50 rounded-lg">
              <Text className="text-2xl font-bold text-purple-600">8.0</Text>
              <Text className="text-sm text-muted-foreground">平均労働時間</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
