import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
type LoginScreenProps = {
  onPressLogin?: () => void;
};

export function LoginScreen({ onPressLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('');

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName, department);
        if (error) {
          setError(error.message);
        } else {
          setMessage('確認メールを送信しました。メールを確認してください。');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.replace('/');
        }
      }
    } catch {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // シンプルなUIラッパ
  const Button = ({ children, onPress, variant = "default", className = "", disabled = false }: any) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={[
        "rounded-xl px-4 py-3 items-center justify-center",
        variant === "ghost" ? "bg-transparent" : "",
        variant === "outline" ? "border border-border bg-transparent" : "",
        disabled ? "opacity-50" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${
        variant === "ghost" ? "text-muted-foreground" : 
        variant === "outline" ? "text-foreground" : 
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

  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-card rounded-2xl border border-border p-6 ${className}`}>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-background">
      {/* 戻るバー */}
      <View className="bg-card border-b border-border shadow-sm">
        <View className="max-w-md mx-auto px-4 py-3">
          <View className="flex-row items-center justify-between">
            <Button
              variant="ghost"
              onPress={() => router.replace('/home')}
              className="flex-row items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 rounded-md transition-colors"
            >
              <Text>←</Text>
              <Text>戻る</Text>
            </Button>
            <View className="flex-row items-center space-x-2">
              <View className="w-6 h-6 bg-primary rounded-md items-center justify-center">
                <Text className="text-primary-foreground text-sm">F</Text>
              </View>
              <Text className="text-sm font-medium text-foreground">SHIFT-CHAT</Text>
            </View>
          </View>
        </View>
      </View>

      {/* メインコンテンツ */}
      <View className="flex items-center justify-center p-4 pt-8">
        <Card className="w-full max-w-md">
          <View className="text-center mb-6">
            <Text className="text-2xl font-bold">FactryNote</Text>
            <Text className="text-muted-foreground mt-2">
              {isSignUp ? 'アカウントを作成してください' : 'ログインしてください'}
            </Text>
          </View>
          <View>
            <View className="space-y-4">
              {isSignUp && (
                <>
                  <View className="space-y-2">
                    <Label>表示名</Label>
                    <Input
                      value={displayName}
                      onChangeText={setDisplayName}
                      placeholder="平木友隆"
                    />
                  </View>
                  <View className="space-y-2">
                    <Label>部署</Label>
                    <Input
                      value={department}
                      onChangeText={setDepartment}
                      placeholder="例: 製造部、品質管理部、保守部など"
                    />
                  </View>
                </>
              )}
              <View className="space-y-2">
                <Label>メールアドレス</Label>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@company.com"
                />
              </View>
              <View className="space-y-2">
                <Label>パスワード</Label>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={true}
                />
              </View>
              
              {error && (
                <View className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Text className="text-red-700 text-sm">{error}</Text>
                </View>
              )}
              
              {message && (
                <View className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Text className="text-green-700 text-sm">{message}</Text>
                </View>
              )}
              
              <Button onPress={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
              </Button>
            </View>
            
            <View className="mt-4 items-center">
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text className="text-primary underline">
                  {isSignUp ? 'ログインに戻る' : 'アカウントを作成する'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="mt-4 p-3 bg-muted rounded-md">
              <Text className="text-sm text-muted-foreground text-center">
                <Text className="font-bold">デモ用:</Text> 任意のメールアドレスでログインできます
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
