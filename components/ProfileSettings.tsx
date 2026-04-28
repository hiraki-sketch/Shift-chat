//profile-settings.tsx
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfileSettingsManagement } from "../src/hooks/useProfileSettingsManagement";
import { User } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AppHeader } from './ui/app-header';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';


interface ProfileSettingsProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => Promise<boolean>;
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
  } = state;
  const { getRoleText, getRoleColor } = utils;
  const {
    setDisplayName,
    setEmail,
    setDepartment,
    handleSaveProfile,
    handleLogoutInternal,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-background">
      <AppHeader
        title="設定・プロフィール"
        subtitle={user.displayName}
        onBack={() => onNavigate('index')}
        rightSlot={
          <Button
            variant="outline"
            onPress={async () => {
              const res = await handleLogoutInternal();
              if (!res.ok) Alert.alert(res.title, res.message);
            }}
            className="border-red-500"
          >
            {loadingLogout ? <ActivityIndicator /> : <Text className="text-red-500">🚪 ログアウト</Text>}
          </Button>
        }
      />

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
