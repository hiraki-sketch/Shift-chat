import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from '../types';
import { useWorkScheduleManagement } from "../src/hooks/useWorkScheduleManagement";
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
interface WorkScheduleProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function WorkSchedule({ user, onNavigate }: WorkScheduleProps) {
  const { state, data, utils, actions } = useWorkScheduleManagement(user);
  const { selectedDate, currentMonth } = state;
  const { scheduleEntries, days, monthNames, dayNames } = data;
  const {
    getShiftColor,
    getShiftTextColor,
    getStatusColor,
    getStatusText,
    formatDateForComparison,
    getScheduleForDate,
  } = utils;
  const { setSelectedDate, previousMonth, nextMonth } = actions;

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200">
        <View className="px-4 py-4">
          <View className="flex-row items-center space-x-4">
            <Button variant="ghost" onPress={() => onNavigate('index')} className="p-2 rounded-lg">
              ←
            </Button>
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
