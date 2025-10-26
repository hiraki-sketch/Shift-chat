import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AttendanceRecord, User } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

// user側の操作によって出勤管理を行う。
interface AttendanceManagementProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function AttendanceManagement({
  user,
  onNavigate,
}: AttendanceManagementProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState<
    "not_started" | "working" | "on_break" | "finished"
  >("not_started");

  // モックデータ
  const todayAttendance: Partial<AttendanceRecord> = {
    id: "1",
    userId: user.id,
    date: new Date().toISOString().split("T")[0],
    shift: "1勤",
    clockIn: "08:00",
    status: "present",
  };

  const recentAttendance: AttendanceRecord[] = [
    {
      id: "1",
      userId: user.id,
      date: "2024-12-19",
      shift: "1勤",
      clockIn: "08:02",
      clockOut: "16:05",
      breakStart: "12:00",
      breakEnd: "13:00",
      status: "present",
      notes: "",
    },
    {
      id: "2",
      userId: user.id,
      date: "2024-12-18",
      shift: "2勤",
      clockIn: "16:10",
      clockOut: "00:15",
      breakStart: "20:00",
      breakEnd: "21:00",
      status: "late",
      notes: "交通遅延のため遅刻",
    },
    {
      id: "3",
      userId: user.id,
      date: "2024-12-17",
      shift: "1勤",
      clockIn: "08:00",
      clockOut: "16:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      status: "present",
      notes: "",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "late":
        return "bg-red-500";
      case "absent":
        return "bg-gray-500";
      case "early_leave":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "出勤";
      case "late":
        return "遅刻";
      case "absent":
        return "欠勤";
      case "early_leave":
        return "早退";
      default:
        return "不明";
    }
  };

  const handleClockIn = () => {
    setTodayStatus("working");
    console.log("出勤打刻:", formatTime(currentTime));
  };

  const handleClockOut = () => {
    setTodayStatus("finished");
    console.log("退勤打刻:", formatTime(currentTime));
  };

  const handleBreakStart = () => {
    setTodayStatus("on_break");
    console.log("休憩開始:", formatTime(currentTime));
  };

  const handleBreakEnd = () => {
    setTodayStatus("working");
    console.log("休憩終了:", formatTime(currentTime));
  };

  const calculateWorkTime = (
    clockIn: string,
    clockOut: string,
    breakStart?: string,
    breakEnd?: string,
  ) => {
    const inTime = new Date(`2024-01-01 ${clockIn}`);
    const outTime = new Date(`2024-01-01 ${clockOut}`);

    let workMinutes =
      (outTime.getTime() - inTime.getTime()) / (1000 * 60);

    if (breakStart && breakEnd) {
      const breakStartTime = new Date(
        `2024-01-01 ${breakStart}`,
      );
      const breakEndTime = new Date(`2024-01-01 ${breakEnd}`);
      const breakMinutes =
        (breakEndTime.getTime() - breakStartTime.getTime()) /
        (1000 * 60);
      workMinutes -= breakMinutes;
    }

    const hours = Math.floor(workMinutes / 60);
    const minutes = workMinutes % 60;

    return `${hours}時間${minutes}分`;
  };

  // シンプルなUIラッパ
  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-card/80 rounded-2xl border border-border p-4 ${className}`}>
      {children}
    </View>
  );

  const Button = ({ children, onPress, variant = "default", className = "" }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={[
        "rounded-xl px-4 py-3 items-center justify-center",
        variant === "outline" ? "border border-border bg-transparent" : "",
        variant === "destructive" ? "bg-red-500" : "",
        variant === "default" ? "bg-primary" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${variant === "default" ? "text-white" : variant === "destructive" ? "text-white" : "text-foreground"} text-base font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  const Badge = ({ children, variant = "secondary", className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${variant === "secondary" ? "bg-muted" : "bg-primary"} ${className}`}>
      <Text className="text-xs text-foreground font-medium">
        {children}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="bg-card border-b border-border">
        <View className="px-5 py-4">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={() => onNavigate("index")}
              className="p-2 rounded-xl"
            >
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-semibold text-foreground">出勤管理</Text>
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
                <Text className="text-lg font-semibold flex-row items-center">
                  <Text className="mr-2">⏰</Text>
                  <Text>打刻</Text>
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
                        className="w-full h-12"
                      >
                        <Text className="mr-2">▶️</Text>
                        <Text>出勤</Text>
                      </Button>
                    )}

                    {todayStatus === "working" && (
                      <View className="space-y-2">
                        <Button
                          onPress={handleBreakStart}
                          variant="outline"
                          className="w-full h-12"
                        >
                          <Text className="mr-2">☕</Text>
                          <Text>休憩開始</Text>
                        </Button>
                        <Button
                          onPress={handleClockOut}
                          variant="destructive"
                          className="w-full h-12"
                        >
                          <Text className="mr-2">⏹️</Text>
                          <Text>退勤</Text>
                        </Button>
                      </View>
                    )}

                    {todayStatus === "on_break" && (
                      <View className="space-y-2">
                        <View className="flex-row items-center gap-3 bg-muted rounded-2xl p-4">
                          <Text className="text-2xl">☕</Text>
                          <Text className="text-base text-foreground">
                            現在休憩中です
                          </Text>
                        </View>
                        <Button
                          onPress={handleBreakEnd}
                          className="w-full h-12"
                        >
                          <Text className="mr-2">▶️</Text>
                          <Text>休憩終了</Text>
                        </Button>
                      </View>
                    )}

                    {todayStatus === "finished" && (
                      <View className="flex-row items-center gap-3 bg-muted rounded-2xl p-4">
                        <Text className="text-base text-foreground">
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
                  <Text className="text-sm font-medium">
                    {todayAttendance.clockIn || "未打刻"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted-foreground">退勤時刻</Text>
                  <Text className="text-sm font-medium">
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
