import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Shift, Thread, User } from '../types';
interface CreateChatThreadProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function CreateChatThread({ user, onNavigate }: CreateChatThreadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | 'all'>('all');
  const [isPublic, setIsPublic] = useState(true);
  const [allowFileSharing, setAllowFileSharing] = useState(true);
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shifts: (Shift | 'all')[] = ['all', '1勤', '2勤', '3勤'];

  const getShiftText = (shift: Shift | 'all') => {
    switch (shift) {
      case 'all': return '全勤務帯';
      case '1勤': return '1勤';
      case '2勤': return '2勤';
      case '3勤': return '3勤';
      default: return '不明';
    }
  };

  const getShiftColor = (shift: Shift | 'all') => {
    switch (shift) {
      case 'all': return 'bg-gray-100';
      case '1勤': return 'bg-blue-100';
      case '2勤': return 'bg-green-100';
      case '3勤': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('チャットタイトルを入力してください');
      return;
    }

    setIsSubmitting(true);

    const newThread: Thread = {
      id: Date.now().toString(),
      title: title.trim(),
      department: user.department,
      shift: selectedShift === 'all' ? undefined : selectedShift,
      createdBy: user.displayName,
      createdAt: new Date().toISOString(),
      messageCount: 0
    };

    // 実際の実装では、ここでSupabaseにデータを送信
    console.log('新しいチャットスレッド:', {
      ...newThread,
      description,
      isPublic,
      allowFileSharing,
      notifyMembers
    });

    setTimeout(() => {
      setIsSubmitting(false);
      alert('チャットスレッドを作成しました');
      onNavigate('chat-threads');
    }, 1000);
  };

  const handleCancel = () => {
    if (title.trim() || description.trim()) {
      if (confirm('入力内容が破棄されますが、よろしいですか？')) {
        onNavigate('chat-threads');
      }
    } else {
      onNavigate('chat-threads');
    }
  };

  // プリセットテンプレート
  const templates = [
    {
      title: '日次引き継ぎ - {shift}',
      description: '勤務帯の引き継ぎ事項や注意事項を共有するためのチャットです。',
      shift: '1勤' as Shift
    },
    {
      title: '設備点検連絡',
      description: '設備の点検状況や異常の報告・対応を行うためのチャットです。',
      shift: 'all' as const
    },
    {
      title: '品質管理情報',
      description: '品質チェックの結果や改善提案を共有するためのチャットです。',
      shift: 'all' as const
    },
    {
      title: '安全管理連絡',
      description: '安全に関する情報共有や事故報告を行うためのチャットです。',
      shift: 'all' as const
    }
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    const shiftText = template.shift === 'all' ? '全勤務帯' : template.shift;
    setTitle(template.title.replace('{shift}', shiftText));
    setDescription(template.description);
    setSelectedShift(template.shift);
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
        variant === "default" ? "bg-primary" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${variant === "outline" ? "text-foreground" : "text-white"} text-base font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  const Badge = ({ children, className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md bg-muted ${className}`}>
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
              onPress={handleCancel}
              className="p-2 rounded-xl"
            >
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-semibold text-foreground">新しいチャット作成</Text>
              <Text className="text-sm text-muted-foreground">{user.department}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-5">
        <View className="space-y-6">
          {/* メインフォーム */}
          <View className="space-y-6">
            <Card>
              <View className="mb-4">
                <Text className="text-lg font-semibold flex-row items-center">
                  <Text className="mr-2">💬</Text>
                  <Text>チャット詳細</Text>
                </Text>
              </View>
              <View className="space-y-4">
                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">チャットタイトル *</Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="例：1勤 日次引き継ぎ"
                    className="border border-border rounded-xl px-4 py-3 text-foreground bg-background"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">説明</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="このチャットの目的や使用方法を説明してください"
                    multiline
                    numberOfLines={3}
                    className="border border-border rounded-xl px-4 py-3 text-foreground bg-background"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="text-sm font-medium text-foreground">対象勤務帯</Text>
                  <ResponsiveGrid maxCols={{ sm:2, md:4, lg:4, xl:4, "2xl":4 }}>
                    {shifts.map((shift) => (
                      <TouchableOpacity
                        key={shift}
                        onPress={() => setSelectedShift(shift)}
                        className={`px-3 py-2 rounded-xl border ${
                          selectedShift === shift
                            ? 'bg-primary border-primary'
                            : 'bg-transparent border-border'
                        }`}
                      >
                        <Text className={`${
                          selectedShift === shift ? 'text-white' : 'text-foreground'
                        } text-sm`}>
                          {getShiftText(shift)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ResponsiveGrid>
                </View>

                <View className="space-y-3">
                  <Text className="text-sm font-medium text-foreground">チャット設定</Text>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-foreground">部署全体に公開する</Text>
                    <Switch
                      value={isPublic}
                      onValueChange={setIsPublic}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-foreground">ファイル共有を許可する</Text>
                    <Switch
                      value={allowFileSharing}
                      onValueChange={setAllowFileSharing}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-foreground">メンバーに作成通知を送信する</Text>
                    <Switch
                      value={notifyMembers}
                      onValueChange={setNotifyMembers}
                    />
                  </View>
                </View>
              </View>
            </Card>

            <View className="flex-row space-x-4">
              <Button
                onPress={handleCancel}
                variant="outline"
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                onPress={handleSubmit}
                disabled={isSubmitting || !title.trim()}
                className="flex-1"
              >
                {isSubmitting ? '作成中...' : 'チャットを作成'}
              </Button>
            </View>
          </View>

          {/* サイドバー */}
          <View className="space-y-6">
            {/* プレビュー */}
            <Card>
              <View className="mb-4">
                <Text className="text-base font-semibold">プレビュー</Text>
              </View>
              <View className="p-3 border rounded-lg bg-muted">
                <View className="flex-row items-center space-x-3">
                  <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                    <Text className="text-2xl">💬</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-foreground text-base">
                      {title || 'チャットタイトル'}
                    </Text>
                    <View className="flex-row items-center space-x-2 mt-1">
                      <Badge className={getShiftColor(selectedShift)}>
                        {getShiftText(selectedShift)}
                      </Badge>
                      <Text className="text-sm text-muted-foreground">{user.department}</Text>
                    </View>
                    {description && (
                      <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
                        {description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Card>

            {/* テンプレート */}
            <Card>
              <View className="mb-4">
                <Text className="text-base font-semibold">テンプレート</Text>
              </View>
              <View className="space-y-2">
                {templates.map((template, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => applyTemplate(template)}
                    className="w-full border border-border rounded-xl p-3 bg-transparent"
                  >
                    <View className="text-left">
                      <Text className="font-medium text-sm text-foreground">
                        {template.title.replace('{shift}', getShiftText(template.shift))}
                      </Text>
                      <Text className="text-xs text-muted-foreground mt-1">
                        {template.description.substring(0, 40)}...
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            {/* ヘルプ */}
            <View className="bg-muted rounded-2xl p-4">
              <View className="flex-row items-start space-x-2">
                <Text className="text-2xl">ℹ️</Text>
                <View className="flex-1 space-y-2">
                  <Text className="text-sm text-foreground">
                    <Text className="font-bold">公開設定:</Text> 部署全体に公開すると、すべてのメンバーが参加できます。
                  </Text>
                  <Text className="text-sm text-foreground">
                    <Text className="font-bold">勤務帯設定:</Text> 特定の勤務帯を選択すると、その勤務帯のメンバーのみが対象になります。
                  </Text>
                  <Text className="text-sm text-foreground">
                    <Text className="font-bold">ファイル共有:</Text> 画像や文書などのファイルをチャット内で共有できます。
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
