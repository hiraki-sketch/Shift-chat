import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from '../types';
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useVacationManagement } from "../src/hooks/useVacationManagement";
interface VacationManagementProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function VacationManagement({ user, onNavigate }: VacationManagementProps) {
  const { state, data, utils, actions } = useVacationManagement(user);
  const { isModalOpen, startDate, endDate, vacationType, reason } = state;
  const { vacationBalance, vacationRequests } = data;
  const { getStatusColor, getStatusText, getStatusIcon, getTypeText, calculateDays } = utils;
  const {
    setIsModalOpen,
    setStartDate,
    setEndDate,
    setVacationType,
    setReason,
    handleSubmitRequest,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200">
        <View className="px-4 py-4">
            <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <Button
                variant="ghost"
                onPress={() => onNavigate('index')}
                className="p-2 rounded-lg"
              >
                ←
              </Button>
              <View>
                <Text className="text-xl font-semibold text-gray-900">有給休暇管理</Text>
                <Text className="text-sm text-gray-500">{user.displayName} - {user.department}</Text>
              </View>
            </View>
            <Button onPress={() => setIsModalOpen(true)}>
              <Text className="text-white font-semibold">➕ 新規申請</Text>
            </Button>
          </View>
        </View>
      </View>

      <View className="p-4 space-y-6">
        <ResponsiveGrid maxCols={{ sm:1, md:2, lg:3, xl:3, "2xl":3 }}>
          {/* 有給残日数 */}
          <View className="basis-full lg:basis-[32%] flex-1">
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold flex-row items-center">
                  <Text className="mr-2">📅</Text>
                  <Text>有給残日数</Text>
                </Text>
              </View>
              <View className="space-y-4">
                <View className="text-center">
                  <Text className="text-4xl font-bold text-blue-600">
                    {vacationBalance.remainingDays}
                  </Text>
                  <Text className="text-sm text-gray-600">残り日数</Text>
                </View>
                
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">年間付与日数</Text>
                    <Text className="text-sm font-medium">{vacationBalance.totalDays}日</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">使用済み</Text>
                    <Text className="text-sm font-medium">{vacationBalance.usedDays}日</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">残り</Text>
                    <Text className="text-sm font-medium text-blue-600">{vacationBalance.remainingDays}日</Text>
                  </View>
                </View>

                <View className="w-full bg-gray-200 rounded-full h-2">
                  <View 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(vacationBalance.usedDays / vacationBalance.totalDays) * 100}%` }}
                  />
                </View>

                {vacationBalance.expiringSoon > 0 && (
                  <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <Text className="text-sm text-yellow-800">
                      <Text className="font-bold">注意:</Text> {vacationBalance.expiringSoon}日が来年3月末で失効予定です
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          </View>

          {/* 申請履歴 */}
          <View className="basis-full lg:basis-[65%] flex-1">
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold">申請履歴</Text>
              </View>
              <View className="space-y-4">
                {vacationRequests.map((request) => (
                  <View key={request.id} className="border rounded-lg p-4 bg-gray-50">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-row items-center space-x-2">
                        <Badge variant="outline">{getTypeText(request.type)}</Badge>
                        <View className={`px-2 py-1 rounded-md ${getStatusColor(request.status)}`}>
                          <Text className="text-xs text-white font-medium">
                            {getStatusText(request.status)}
                          </Text>
                        </View>
                        <Text className="text-lg">{getStatusIcon(request.status)}</Text>
                      </View>
                      <Text className="text-sm text-gray-500">
                        {calculateDays(request.startDate, request.endDate)}日間
                      </Text>
                    </View>

                    <View className="space-y-2">
                      <View>
                        <Text className="text-sm text-gray-600">期間:</Text>
                        <Text className="text-sm font-medium">
                          {new Date(request.startDate).toLocaleDateString('ja-JP')} 〜 
                          {new Date(request.endDate).toLocaleDateString('ja-JP')}
                        </Text>
                      </View>
                      
                      <View>
                        <Text className="text-sm text-gray-600">理由:</Text>
                        <Text className="text-sm">{request.reason}</Text>
                      </View>

                      <Text className="text-sm text-gray-500">
                        申請日時: {new Date(request.requestedAt).toLocaleString('ja-JP')}
                      </Text>

                      {request.status === 'approved' && request.approvedBy && (
                        <Text className="text-sm text-green-600">
                          {request.approvedBy} により承認 
                          ({new Date(request.approvedAt!).toLocaleString('ja-JP')})
                        </Text>
                      )}

                      {request.status === 'rejected' && request.rejectionReason && (
                        <View className="bg-red-50 p-2 rounded">
                          <Text className="text-sm text-red-600">
                            却下理由: {request.rejectionReason}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        </ResponsiveGrid>

        {/* 統計情報 */}
        <Card>
          <View className="mb-4">
            <Text className="text-lg font-semibold">年間統計</Text>
          </View>
          <ResponsiveGrid maxCols={{ sm:2, md:4, lg:4, xl:4, "2xl":4 }}>
            <View className="text-center p-4 bg-green-50 rounded-lg">
              <Text className="text-2xl font-bold text-green-600">6</Text>
              <Text className="text-sm text-gray-600">承認済み申請</Text>
            </View>
            <View className="text-center p-4 bg-yellow-50 rounded-lg">
              <Text className="text-2xl font-bold text-yellow-600">1</Text>
              <Text className="text-sm text-gray-600">承認待ち</Text>
            </View>
            <View className="text-center p-4 bg-red-50 rounded-lg">
              <Text className="text-2xl font-bold text-red-600">1</Text>
              <Text className="text-sm text-gray-600">却下</Text>
            </View>
            <View className="text-center p-4 bg-blue-50 rounded-lg">
              <Text className="text-2xl font-bold text-blue-600">2.1</Text>
              <Text className="text-sm text-gray-600">平均取得日数/月</Text>
            </View>
          </ResponsiveGrid>
        </Card>
      </View>

      {/* 申請モーダル */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="bg-white border-b border-gray-200">
            <View className="px-4 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold">休暇申請</Text>
                <Button variant="ghost" onPress={() => setIsModalOpen(false)} className="text-blue-600">
                  キャンセル
                </Button>
              </View>
            </View>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <View>
                <Label>休暇種別</Label>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { value: 'paid_leave', label: '有給休暇' },
                    { value: 'sick_leave', label: '病気休暇' },
                    { value: 'personal_leave', label: '私用休暇' },
                    { value: 'compensatory_leave', label: '代休' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setVacationType(type.value as any)}
                      className={`px-3 py-2 rounded-lg border ${
                        vacationType === type.value 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'bg-transparent border-gray-300'
                      }`}
                    >
                      <Text className={`text-sm ${
                        vacationType === type.value ? 'text-white' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Label>開始日</Label>
                  <Input
                    placeholder="YYYY-MM-DD"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
                <View className="flex-1">
                  <Label>終了日</Label>
                  <Input
                    placeholder="YYYY-MM-DD"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              {startDate && endDate && (
                <Text className="text-sm text-gray-600">
                  申請日数: {calculateDays(startDate, endDate)}日
                </Text>
              )}

              <View>
                <Label>理由</Label>
                <Input
                  value={reason}
                  onChangeText={setReason}
                  placeholder="休暇を取得する理由を入力してください"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <Button
              onPress={() => {
                const res = handleSubmitRequest();
                Alert.alert(res.title, res.message);
              }}
            >
              申請提出
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
}

