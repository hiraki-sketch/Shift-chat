//profile-settings.tsx
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from '../types';


interface ProfileSettingsProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ProfileSettings({ user, onNavigate, onLogout }: ProfileSettingsProps) {
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(user.department);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveProfile = () => {
    console.log('プロフィール更新:', { displayName, email, department });
    alert('プロフィールを更新しました');
  };

  const handleExportData = () => {
    console.log('データエクスポート');
    alert('データエクスポートを開始しました。完了後にダウンロードリンクが送信されます。');
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return '管理者';
      case 'manager': return 'リーダー';
      case 'user': return '一般ユーザー';
      default: return '不明';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'manager': return 'bg-blue-500';
      case 'user': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  // シンプルなUIラッパ
  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-card rounded-2xl border border-border p-4 ${className}`}>
      {children}
    </View>
  );

  const Button = ({ children, onPress, variant = "default", className = "", disabled = false }: any) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={[
        "rounded-xl px-4 py-3 items-center justify-center",
        variant === "outline" ? "border border-border bg-transparent" : "",
        variant === "destructive" ? "bg-red-500" : "",
        variant === "default" ? "bg-primary" : "",
        disabled ? "opacity-50" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${
        variant === "outline" ? "text-foreground" : 
        variant === "destructive" ? "text-white" : 
        "text-white"
      } text-base font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  const Input = ({ value, onChangeText, placeholder, secureTextEntry = false }: any) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      className="border border-border rounded-lg px-3 py-2 text-foreground bg-background"
      placeholderTextColor="#6b7280"
    />
  );

  const Label = ({ children, className = "" }: any) => (
    <Text className={`text-sm font-medium text-foreground mb-2 ${className}`}>
      {children}
    </Text>
  );

  const Badge = ({ children, variant = "secondary", className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${variant === "secondary" ? "bg-muted" : "bg-primary"} ${className}`}>
      <Text className="text-xs text-foreground font-medium">
        {children}
      </Text>
    </View>
  );
  const handleLogoutInternal = async () => {
    if (onLogout) {
      return onLogout();
    }
    try {
      setLoadingLogout(true);
      await supabase.auth.signOut();
      router.replace('/login');
    } catch {
      Alert.alert('ログアウトに失敗しました。もう一度お試しください');
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="bg-card border-b border-border">
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => onNavigate('index')}
                className="p-2 rounded-xl"
              >
                <Text className="text-2xl">←</Text>
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-semibold text-foreground">設定・プロフィール</Text>
                <Text className="text-sm text-muted-foreground">{user.displayName}</Text>
              </View>
            </View>
            <Button
              variant="outline"
              onPress={handleLogoutInternal}
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
        <Card>
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
              <Button onPress={handleSaveProfile}>
                プロフィールを更新
              </Button>
            </View>
          </View>
        </Card>

        {/* 通知設定 */}
        <Card>
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
        <Card>
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
        <Card>
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
              <Button variant="outline" onPress={handleExportData}>
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
