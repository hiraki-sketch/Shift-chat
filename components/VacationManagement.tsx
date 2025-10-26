import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { User, VacationRequest } from '../types';
interface VacationManagementProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function VacationManagement({ user, onNavigate }: VacationManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacationType, setVacationType] = useState<'paid_leave' | 'sick_leave' | 'personal_leave' | 'compensatory_leave'>('paid_leave');
  const [reason, setReason] = useState('');

  // モック有給データ
  const vacationBalance = {
    totalDays: 20,
    usedDays: 8,
    remainingDays: 12,
    expiringSoon: 5 // 来年3月末で失効予定
  };

  // モック申請データ
  const vacationRequests: VacationRequest[] = [
    {
      id: '1',
      userId: user.id,
      startDate: '2024-12-25',
      endDate: '2024-12-27',
      type: 'paid_leave',
      reason: '年末年始休暇',
      status: 'approved',
      requestedAt: '2024-12-10 09:00',
      approvedBy: '部長 山田',
      approvedAt: '2024-12-10 14:30'
    },
    {
      id: '2',
      userId: user.id,
      startDate: '2024-12-30',
      endDate: '2024-12-30',
      type: 'personal_leave',
      reason: '家族の用事',
      status: 'pending',
      requestedAt: '2024-12-15 11:20'
    },
    {
      id: '3',
      userId: user.id,
      startDate: '2024-11-20',
      endDate: '2024-11-21',
      type: 'paid_leave',
      reason: 'リフレッシュ休暇',
      status: 'approved',
      requestedAt: '2024-11-05 10:15',
      approvedBy: '部長 山田',
      approvedAt: '2024-11-05 16:45'
    },
    {
      id: '4',
      userId: user.id,
      startDate: '2024-11-01',
      endDate: '2024-11-01',
      type: 'sick_leave',
      reason: '体調不良',
      status: 'rejected',
      requestedAt: '2024-10-30 08:30',
      rejectionReason: '事前申請が必要です'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '承認済み';
      case 'pending': return '承認待ち';
      case 'rejected': return '却下';
      default: return '不明';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏰';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'paid_leave': return '有給休暇';
      case 'sick_leave': return '病気休暇';
      case 'personal_leave': return '私用休暇';
      case 'compensatory_leave': return '代休';
      default: return '不明';
    }
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmitRequest = () => {
    if (!startDate || !endDate || !reason.trim()) {
      Alert.alert('エラー', 'すべての項目を入力してください');
      return;
    }

    const newRequest: VacationRequest = {
      id: Date.now().toString(),
      userId: user.id,
      startDate,
      endDate,
      type: vacationType,
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    console.log('新しい休暇申請:', newRequest);
    
    // フォームをリセット
    setStartDate('');
    setEndDate('');
    setReason('');
    setVacationType('paid_leave');
    setIsModalOpen(false);
    
    Alert.alert('完了', '休暇申請を提出しました');
  };

  // シンプルなUIラッパ
  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </View>
  );

  const Button = ({ children, onPress, variant = "default", className = "" }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={[
        "rounded-lg px-4 py-3 items-center justify-center",
        variant === "outline" ? "border border-gray-300 bg-transparent" : "",
        variant === "default" ? "bg-blue-600" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${
        variant === "default" ? "text-white" : "text-gray-700"
      } text-base font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  const Input = ({ value, onChangeText, placeholder, className = "" }: any) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white ${className}`}
      placeholderTextColor="#9ca3af"
    />
  );

  const Badge = ({ children, variant = "secondary", className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${variant === "secondary" ? "bg-gray-100" : "bg-gray-200"} ${className}`}>
      <Text className="text-xs text-gray-700 font-medium">
        {children}
      </Text>
    </View>
  );

  const Label = ({ children, className = "" }: any) => (
    <Text className={`text-sm font-medium text-gray-700 mb-2 ${className}`}>
      {children}
    </Text>
  );

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200">
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => onNavigate('index')}
                className="p-2 rounded-lg"
              >
                <Text className="text-2xl">←</Text>
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-semibold text-gray-900">有給休暇管理</Text>
                <Text className="text-sm text-gray-500">{user.displayName} - {user.department}</Text>
              </View>
            </View>
            <Button onPress={() => setIsModalOpen(true)}>
              <Text className="mr-2">➕</Text>
              <Text>新規申請</Text>
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
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <Text className="text-blue-600 text-base">キャンセル</Text>
                </TouchableOpacity>
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
                <TextInput
                  value={reason}
                  onChangeText={setReason}
                  placeholder="休暇を取得する理由を入力してください"
                  multiline
                  numberOfLines={3}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <Button onPress={handleSubmitRequest}>
              申請提出
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
}

