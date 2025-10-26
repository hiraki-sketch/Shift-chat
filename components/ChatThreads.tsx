import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Message, Shift, Thread, User } from '../types';
import { Clock, MessageCircle } from './ui/icons';
interface ChatThreadsProps {
  user: User;
  selectedShift: Shift;
  onNavigate: (page: string) => void;
}

export function ChatThreads({ user, selectedShift, onNavigate }: ChatThreadsProps) {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // モックデ
  const threads: Thread[] = [
    {
      id: '1',
      title: '1勤 日次引き継ぎ',
      department: user.department,
      shift: '1勤',
      createdBy: '班長おおやま ',
      createdAt: '2024-12-20 08:00',
      messageCount: 15
    },
    {
      id: '2',
      title: '2勤 設備点検',
      department: user.department,
      shift: '2勤',
      createdBy: '保守 まさし',
      createdAt: '2024-12-20 16:00',
      messageCount: 8
    },
    {
      id: '3',
      title: '3勤 清掃作業',
      department: user.department,
      shift: '3勤',
      createdBy: '清掃 まさし',
      createdAt: '2024-12-20 00:00',
      messageCount: 3
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      threadId: '1',
      author: '班長 まさし',
      body: 'おはようございます。ちゃんとやりよんかいねえ!!!!!本日の作業予定を共有します。',
      createdAt: '2024-12-20 08:00'
    },
    {
      id: '2',
      threadId: '1',
      author: '作業者飯尾',
      body: 'すすす、、、すいません!!!!!。ライン2の調子はどうでしょうか？',
      createdAt: '2024-12-20 08:05'
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;
    console.log('新しいメッセージ:', { threadId: selectedThread.id, message: newMessage });
    setNewMessage('');
  };



  const Badge = ({ children, variant = "secondary", className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${variant === "secondary" ? "bg-muted" : "bg-primary"} ${className}`}>
      <Text className="text-xs text-foreground font-medium">
        {children}
      </Text>
    </View>
  );

  if (selectedThread) {
    const threadMessages = mockMessages.filter(m => m.threadId === selectedThread.id);
    
    return (
      <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background">
        {/* ヘッダー */}
        <View className="bg-card border-b border-border">
          <View className="px-5 py-4">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => setSelectedThread(null)}
                className="p-2 rounded-xl"
              >
                <Text className="text-2xl">←</Text>
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-semibold text-foreground">{selectedThread.title}</Text>
                <View className="flex-row items-center space-x-2 mt-1">
                  <Text className="text-sm text-muted-foreground">{selectedThread.department}</Text>
                  {selectedThread.shift && <Badge variant="secondary">{selectedThread.shift}</Badge>}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* メッセージ一覧 */}
        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            {threadMessages.map((message) => (
              <View key={message.id} className="flex-row space-x-3">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
                  <Text className="text-white text-sm font-medium">
                    {message.author.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-sm font-medium text-foreground">{message.author}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString('ja-JP')}
                    </Text>
                  </View>
                  <View className="mt-1 bg-card rounded-lg p-3 border">
                    <Text className="text-sm text-foreground">{message.body}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* メッセージ入力 */}
        <View className="bg-card border-t border-border p-4">
          <View className="flex-row space-x-3">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="メッセージを入力..."
              className="flex-1 border border-border rounded-xl px-4 py-3 text-foreground"
              multiline
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`px-4 py-3 rounded-xl ${newMessage.trim() ? 'bg-primary' : 'bg-muted'}`}
            >
              <Text className="text-white font-medium">送信</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
    );
  }

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
                <Text className="text-xl font-semibold text-foreground">チャットスレッド</Text>
                <Text className="text-sm text-muted-foreground">{user.department}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onNavigate('create-chat')}
              className="bg-primary px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-medium">新規作成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* スレッド一覧 */}
      <View className="p-5">
        <ResponsiveGrid maxCols={{ sm:1, md:2, lg:2, xl:2, "2xl":2 }}>
          {threads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              onPress={() => setSelectedThread(thread)}
              className="bg-card/80 rounded-2xl border border-border p-4"
            >
              <View className="flex-row items-start space-x-3">
                <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                  <MessageCircle size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-foreground text-base">{thread.title}</Text>
                  <View className="flex-row items-center space-x-2 mt-1">
                    {thread.shift && <Badge variant="secondary">{thread.shift}</Badge>}
                    <Text className="text-sm text-muted-foreground">{thread.department}</Text>
                  </View>
                  <View className="flex-row items-center space-x-4 mt-2">
                    <View className="flex-row items-center space-x-1">
                      <View className="flex-row items-center space-x-1">
                        <MessageCircle size={12} color="#6B7280" />
                        <Text className="text-xs text-muted-foreground">{thread.messageCount} メッセージ</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center space-x-1">
                      <View className="flex-row items-center space-x-1">
                        <Clock size={12} color="#6B7280" />
                        <Text className="text-xs text-muted-foreground">{new Date(thread.createdAt).toLocaleDateString('ja-JP')}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <Text className="text-sm text-muted-foreground">{thread.createdBy}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ResponsiveGrid>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
