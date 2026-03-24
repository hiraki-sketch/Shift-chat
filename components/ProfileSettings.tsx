//profile-settings.tsx
import { ActivityIndicator, Alert, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from '../types';
import { useProfileSettingsManagement } from "../src/hooks/useProfileSettingsManagement";
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';


interface ProfileSettingsProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ProfileSettings({ user, onNavigate, onLogout }: ProfileSettingsProps) {
  const { state, utils, actions } = useProfileSettingsManagement({
    user,
    onNavigate,
    onLogout,
  });
  const {
    loadingLogout,
    loadingSave,
    displayName,
    email,
    department,
    notificationsEnabled,
    emailNotifications,
  } = state;
  const { getRoleText, getRoleColor } = utils;
  const {
    setDisplayName,
    setEmail,
    setDepartment,
    setNotificationsEnabled,
    setEmailNotifications,
    handleSaveProfile,
    handleExportData,
    handleLogoutInternal,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="bg-card border-b border-border">
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <Button
                variant="ghost"
                onPress={() => onNavigate('index')}
                className="p-2 rounded-xl"
              >
                ←
              </Button>
              <View>
                <Text className="text-xl font-semibold text-foreground">設定・プロフィール</Text>
                <Text className="text-sm text-muted-foreground">{user.displayName}</Text>
              </View>
            </View>
            <Button
              variant="outline"
              onPress={async () => {
                const res = await handleLogoutInternal();
                if (!res.ok) Alert.alert(res.title, res.message);
              }}
              className="border-red-500"
            >
              {loadingLogout ? (
                <ActivityIndicator />
              ) : (
              <Text className="text-red-500">🚪 ログアウト</Text>
              )}
            </Button>
          </View>
        </View>
      </View>

      <View className="p-5 space-y-6">
        {/* プロフィール情報 */}
        <Card className="rounded-2xl p-4">
          <View className="mb-4">
            <Text className="text-lg font-semibold flex-row items-center">
              <Text className="mr-2">👤</Text>
              <Text>プロフィール情報</Text>
            </Text>
          </View>
          <View className="space-y-4">
            <View className="space-y-2">
              <Label>表示名</Label>
              <Input
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="表示名"
              />
            </View>
            <View className="space-y-2">
              <Label>メールアドレス</Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="メールアドレス"
              />
            </View>
            <View className="space-y-2">
              <Label>部署</Label>
              <Input
                value={department}
                onChangeText={setDepartment}
                placeholder="部署名"
              />
            </View>
                         <View className="space-y-2">
               <Label>権限レベル</Label>
               <Badge variant="secondary" className={getRoleColor(user.role || 'user')}>
                 {getRoleText(user.role || 'user')}
               </Badge>
             </View>
            
            <View className="items-end">
              <Button
                onPress={async () => {
                  const res = await handleSaveProfile();
                  Alert.alert(res.title, res.message);
                }}
                disabled={loadingSave}
              >
                {loadingSave ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#fff" className="mr-2" />
                    <Text className="text-white">更新中...</Text>
                  </View>
                ) : (
                  'プロフィールを更新'
                )}
              </Button>
            </View>
          </View>
        </Card>

        {/* 通知設定 */}
        <Card className="rounded-2xl p-4">
          <View className="mb-4">
            <Text className="text-lg font-semibold flex-row items-center">
              <Text className="mr-2">🔔</Text>
              <Text>通知設定</Text>
            </Text>
          </View>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium">通知を有効にする</Text>
                <Text className="text-sm text-muted-foreground">
                  異常報告やメッセージの通知を受け取ります
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            {notificationsEnabled && (
              <View className="flex-row items-center justify-between pl-4">
                <View className="flex-1">
                  <Text className="font-medium">メール通知</Text>
                  <Text className="text-sm text-muted-foreground">
                    重要な通知をメールで受け取ります
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                />
              </View>
            )}
          </View>
        </Card>

        {/* セキュリティ */}
        <Card className="rounded-2xl p-4">
          <View className="mb-4">
            <Text className="text-lg font-semibold flex-row items-center">
              <Text className="mr-2">🛡️</Text>
              <Text>セキュリティ</Text>
            </Text>
          </View>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium">パスワード変更</Text>
                <Text className="text-sm text-muted-foreground">
                  定期的なパスワード変更を推奨します
                </Text>
              </View>
              <Button variant="outline">
                変更
              </Button>
            </View>
          </View>
        </Card>

        {/* データエクスポート */}
        <Card className="rounded-2xl p-4">
          <View className="mb-4">
            <Text className="text-lg font-semibold flex-row items-center">
              <Text className="mr-2">📥</Text>
              <Text>データエクスポート</Text>
            </Text>
          </View>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-medium">自分のデータをエクスポート</Text>
                <Text className="text-sm text-muted-foreground">
                  投稿した異常報告やメッセージのデータをダウンロードできます
                </Text>
              </View>
              <Button
                variant="outline"
                onPress={() => {
                  const res = handleExportData();
                  Alert.alert(res.title, res.message);
                }}
              >
                エクスポート
              </Button>
            </View>
          </View>
        </Card>

        {/* 注意事項 */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <View className="flex-row items-start space-x-3">
            <Text className="text-blue-600 text-lg">🛡️</Text>
            <Text className="text-blue-800 text-sm flex-1">
              このアプリで扱うデータは業務上重要な情報です。適切なセキュリティ管理を心がけ、
              不正アクセスや情報漏洩の防止にご協力ください。
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
