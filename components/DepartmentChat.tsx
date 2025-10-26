import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { ArrowLeft, Bell, Clock, Pin, Send, User as UserIcon } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shift, User } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
interface DepartmentChatProps {
  user: User;
  onNavigate: (page: string) => void;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  pinned: boolean;
  priority: 'high' | 'medium' | 'low';
  shift?: Shift;
}

export function DepartmentChat({ user, onNavigate }: DepartmentChatProps) {
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  // モックデータ
  const announcements: Announcement[] = [
    {
      id: '1',
      title: '来週の保守点検について',
      content: '来週月曜日から水曜日まで、機械の定期保守点検を実施します。作業時間は通常通りですが、一部のラインが停止する可能性があります。',
      author: '保守担当 佐藤',
      createdAt: '2024-12-20 16:00',
      pinned: true,
      priority: 'high',
      shift: '1勤'
    },
    {
      id: '2',
      title: '安全研修のお知らせ',
      content: '来月の安全研修の日程が決定しました。全員参加必須です。詳細は後日連絡します。',
      author: '安全担当 田中',
      createdAt: '2024-12-19 14:30',
      pinned: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: '年末年始の勤務について',
      content: '年末年始の勤務スケジュールを確認してください。特別勤務手当が支給されます。',
      author: '人事部 山田',
      createdAt: '2024-12-18 10:00',
      pinned: true,
      priority: 'high'
    },
    {
      id: '4',
      title: '品質管理の改善提案',
      content: '品質チェックの効率化について、皆様からのご意見をお待ちしています。',
      author: '品質管理 鈴木',
      createdAt: '2024-12-17 15:45',
      pinned: false,
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '重要';
      case 'medium': return '普通';
      case 'low': return '軽微';
      default: return '不明';
    }
  };

  const handleSendAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    
    console.log('新しい部署連絡:', newAnnouncement);
    setNewAnnouncement('');
    setIsComposing(false);
  };

  return (
    <SafeAreaView className="flex-1">
    <View className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="bg-card border-b border-border">
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => onNavigate('index')} className="p-2 rounded-xl">
                <ArrowLeft size={22} color="#64748b" />
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-semibold text-foreground">部署連絡</Text>
                <Text className="text-sm text-muted-foreground">{user.department}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setIsComposing(!isComposing)} className="p-2 rounded-xl">
              <Bell size={22} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-5">
        <ResponsiveGrid maxCols={{ sm:1, md:2, lg:2, xl:2, "2xl":2 }}>
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <View className="p-4">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-lg font-semibold text-foreground">{announcement.title}</Text>
                      {announcement.pinned && (
                        <View className="flex-row items-center gap-1">
                          <Pin size={14} color="#ef4444" />
                          <Badge variant="outline" className="bg-transparent border border-red-500">
                            <Text className="text-xs text-red-500">ピン留め</Text>
                          </Badge>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-muted-foreground mb-2">{announcement.content}</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                      <UserIcon size={14} color="#64748b" />
                      <Text className="text-xs text-muted-foreground">{announcement.author}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Clock size={14} color="#64748b" />
                      <Text className="text-xs text-muted-foreground">{announcement.createdAt}</Text>
                    </View>
                    {announcement.shift && (
                      <Badge variant="secondary">
                        <Text className="text-xs">{announcement.shift}</Text>
                      </Badge>
                    )}
                  </View>
                  <View className="flex-row items-center gap-1">
                    <View className={`w-2 h-2 rounded-full ${getPriorityColor(announcement.priority)}`} />
                    <Text className="text-xs text-muted-foreground">{getPriorityText(announcement.priority)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </ResponsiveGrid>
      </ScrollView>

      {/* 新規投稿フォーム */}
      {isComposing && (
        <View className="bg-card border-t border-border p-4">
          <View className="gap-3">
            <TextInput
              value={newAnnouncement}
              onChangeText={setNewAnnouncement}
              placeholder="部署連絡を入力してください..."
              multiline
              className="bg-muted rounded-xl p-3 text-foreground min-h-[80px]"
              placeholderTextColor="#64748b"
            />
            <View className="flex-row gap-3">
              <Button 
                variant="outline" 
                onPress={() => setIsComposing(false)}
                className="flex-1"
              >
                <Text>キャンセル</Text>
              </Button>
              <Button 
                onPress={handleSendAnnouncement}
                disabled={!newAnnouncement.trim()}
                className="flex-1"
              >
                <Send size={16} color="white" />
                <Text className="text-white ml-2">送信</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
}
