import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Shift, User } from '../types';
import { useChatThreadsManagement } from "../src/hooks/useChatThreadsManagement";
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Clock, MessageCircle } from './ui/icons';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
interface ChatThreadsProps {
  user: User;
  selectedShift: Shift;
  onNavigate: (page: string) => void;
}

export function ChatThreads({ user, selectedShift, onNavigate }: ChatThreadsProps) {
  const { state, data, derived, actions } = useChatThreadsManagement({
    user,
    selectedShift,
  });
  const { selectedThread, newMessage } = state;
  const { threads, threadMessages } = data;
  const { canSend } = derived;
  const { setSelectedThread, setNewMessage, handleSendMessage } = actions;

  if (selectedThread) {
    return (
      <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background">
        {/* ヘッダー */}
        <View className="bg-card border-b border-border">
          <View className="px-5 py-4">
            <View className="flex-row items-center space-x-4">
              <Button variant="ghost" onPress={() => setSelectedThread(null)} className="p-2 rounded-xl">
                ←
              </Button>
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
            <Input
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="メッセージを入力..."
              className="flex-1 rounded-xl px-4 py-3"
              multiline
            />
            <Button
              onPress={handleSendMessage}
              disabled={!canSend}
              className={`px-4 py-3 rounded-xl ${canSend ? 'bg-primary' : 'bg-muted opacity-70'}`}
            >
              送信
            </Button>
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
              <Button variant="ghost" onPress={() => onNavigate('index')} className="p-2 rounded-xl">
                ←
              </Button>
              <View>
                <Text className="text-xl font-semibold text-foreground">チャットスレッド</Text>
                <Text className="text-sm text-muted-foreground">{user.department}</Text>
              </View>
            </View>
            <Button onPress={() => onNavigate('create-chat')} className="px-4 py-2 rounded-xl">
              新規作成
            </Button>
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
