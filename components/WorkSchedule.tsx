import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Shift, User, WorkScheduleEntry } from '../types';
interface WorkScheduleProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function WorkSchedule({ user, onNavigate }: WorkScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // モックデータ
  const scheduleEntries: WorkScheduleEntry[] = [
    {
      id: '1',
      userId: user.id,
      date: '2024-12-20',
      shift: '1勤',
      startTime: '08:00',
      endTime: '16:00',
      department: user.department,
      status: 'confirmed'
    },
    {
      id: '2',
      userId: user.id,
      date: '2024-12-21',
      shift: '2勤',
      startTime: '16:00',
      endTime: '00:00',
      department: user.department,
      status: 'scheduled'
    },
    {
      id: '3',
      userId: user.id,
      date: '2024-12-22',
      shift: '1勤',
      startTime: '08:00',
      endTime: '16:00',
      department: user.department,
      status: 'scheduled'
    },
    {
      id: '4',
      userId: user.id,
      date: '2024-12-23',
      shift: '3勤',
      startTime: '00:00',
      endTime: '08:00',
      department: user.department,
      status: 'scheduled'
    }
  ];

  const getShiftColor = (shift: Shift) => {
    switch (shift) {
      case '1勤': return 'bg-blue-100';
      case '2勤': return 'bg-green-100';
      case '3勤': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getShiftTextColor = (shift: Shift) => {
    switch (shift) {
      case '1勤': return 'text-blue-800';
      case '2勤': return 'text-green-800';
      case '3勤': return 'text-purple-800';
      default: return 'text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'completed': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '確定';
      case 'scheduled': return '予定';
      case 'completed': return '完了';
      default: return '不明';
    }
  };

  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
 //Supabaseで連携後実装予定
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getScheduleForDate = (date: Date) => {
    const dateStr = formatDateForComparison(date);
    return scheduleEntries.find(entry => entry.date === dateStr);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  // シンプルなUIラッパ
  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </View>
  );

  const Button = ({ children, onPress, variant = "default", size = "default", className = "" }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={[
        "rounded-lg items-center justify-center",
        size === "sm" ? "px-2 py-1" : "px-4 py-3",
        variant === "outline" ? "border border-gray-300 bg-transparent" : "",
        variant === "ghost" ? "bg-transparent" : "",
        variant === "default" ? "bg-blue-600" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${
        variant === "default" ? "text-white" : "text-gray-700"
      } text-sm font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  const Badge = ({ children, className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${className}`}>
      <Text className="text-xs font-medium">
        {children}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200">
        <View className="px-4 py-4">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={() => onNavigate('index')}
              className="p-2 rounded-lg"
            >
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-semibold text-gray-900">勤務表</Text>
              <Text className="text-sm text-gray-500">{user.displayName} - {user.department}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-4 space-y-6">
        <View className="flex-row flex-wrap gap-6">
          {/* カレンダービュー */}
          <View className="basis-full lg:basis-[65%] flex-1">
            <Card>
              <View className="mb-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold flex-row items-center">
                    <Text className="mr-2">📅</Text>
                    <Text>勤務スケジュール</Text>
                  </Text>
                  <View className="flex-row items-center space-x-2">
                    <Button variant="outline" size="sm" onPress={previousMonth}>
                      <Text>◀</Text>
                    </Button>
                    <Text className="text-lg font-medium min-w-[120px] text-center">
                      {currentMonth.getFullYear()}年{monthNames[currentMonth.getMonth()]}
                    </Text>
                    <Button variant="outline" size="sm" onPress={nextMonth}>
                      <Text>▶</Text>
                    </Button>
                  </View>
                </View>
              </View>
              
              <ResponsiveGrid maxCols={{ sm:7, md:7, lg:7, xl:7, "2xl":7 }}>
                {dayNames.map((day) => (
                  <View key={day} className="text-center py-2">
                    <Text className="text-sm font-medium text-gray-500">{day}</Text>
                  </View>
                ))}
              </ResponsiveGrid>
              
              <ResponsiveGrid maxCols={{ sm:7, md:7, lg:7, xl:7, "2xl":7 }}>
                {days.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const isToday = formatDateForComparison(day) === formatDateForComparison(new Date());
                  const schedule = getScheduleForDate(day);
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedDate(day)}
                      className={`
                        min-h-[80px] p-2 border rounded-md
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-100'}
                        ${isToday ? 'border-blue-500 border-2' : ''}
                      `}
                    >
                      <Text className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                        {day.getDate()}
                      </Text>
                      {schedule && isCurrentMonth && (
                        <View className="mt-1">
                          <Badge className={`${getShiftColor(schedule.shift)}`}>
                            <Text className={`text-xs ${getShiftTextColor(schedule.shift)}`}>
                              {schedule.shift}
                            </Text>
                          </Badge>
                          <Text className="text-xs text-gray-600 mt-1">
                            {schedule.startTime}-{schedule.endTime}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ResponsiveGrid>
            </Card>
          </View>

          {/* 勤務詳細 */}
          <View className="basis-full lg:basis-[32%] flex-1 space-y-4">
            {/* 選択された日の勤務 */}
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold">
                  {selectedDate ? 
                    `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日の勤務` : 
                    '今日の勤務'
                  }
                </Text>
              </View>
              <View>
                {(() => {
                  const targetDate = selectedDate || new Date();
                  const todaySchedule = getScheduleForDate(targetDate);
                  if (todaySchedule) {
                    return (
                      <View className="space-y-3">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm text-gray-600">勤務帯</Text>
                          <Badge className={getShiftColor(todaySchedule.shift)}>
                            <Text className={`text-xs ${getShiftTextColor(todaySchedule.shift)}`}>
                              {todaySchedule.shift}
                            </Text>
                          </Badge>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm text-gray-600">時間</Text>
                          <Text className="text-sm font-medium">
                            {todaySchedule.startTime} - {todaySchedule.endTime}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm text-gray-600">状態</Text>
                          <Text className={`text-sm font-medium ${getStatusColor(todaySchedule.status)}`}>
                            {getStatusText(todaySchedule.status)}
                          </Text>
                        </View>
                      </View>
                    );
                  } else {
                    return (
                      <Text className="text-sm text-gray-500">今日は休日です</Text>
                    );
                  }
                })()}
              </View>
            </Card>

            {/* 今週の勤務予定 */}
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold">今週の予定</Text>
              </View>
              <View className="space-y-3">
                {scheduleEntries.slice(0, 5).map((entry) => (
                  <View key={entry.id} className="flex-row items-center justify-between p-2 bg-gray-50 rounded-md">
                    <View>
                      <Text className="text-sm font-medium">
                        {new Date(entry.date).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        {entry.startTime} - {entry.endTime}
                      </Text>
                    </View>
                    <Badge className={getShiftColor(entry.shift)}>
                      <Text className={`text-xs ${getShiftTextColor(entry.shift)}`}>
                        {entry.shift}
                      </Text>
                    </Badge>
                  </View>
                ))}
              </View>
            </Card>

            {/* 勤務統計 */}
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold">今月の統計</Text>
              </View>
              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">総勤務日数</Text>
                  <Text className="text-sm font-medium">20日</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">1勤回数</Text>
                  <Text className="text-sm font-medium">8回</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">2勤回数</Text>
                  <Text className="text-sm font-medium">7回</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600">3勤回数</Text>
                  <Text className="text-sm font-medium">5回</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
