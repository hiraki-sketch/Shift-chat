import { ArrowLeft, Bell, Clock, Pin, Send, User as UserIcon } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../types';
import { useDepartmentChatManagement } from "../src/hooks/useDepartmentChatManagement";
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
interface DepartmentChatProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function DepartmentChat({ user, onNavigate }: DepartmentChatProps) {
  const { state, data, derived, utils, actions } = useDepartmentChatManagement(user);
  const { newAnnouncement, isComposing } = state;
  const { announcements } = data;
  const { canSend } = derived;
  const { getPriorityColor, getPriorityText } = utils;
  const {
    setNewAnnouncement,
    handleToggleCompose,
    handleCancelCompose,
    handleSendAnnouncement,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
    <View className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="bg-card border-b border-border">
        <View className="px-5 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Button variant="ghost" onPress={() => onNavigate('index')} className="p-2 rounded-xl">
                <ArrowLeft size={22} color="#64748b" />
              </Button>
              <View>
                <Text className="text-xl font-semibold text-foreground">部署連絡</Text>
                <Text className="text-sm text-muted-foreground">{user.department}</Text>
              </View>
            </View>
            <Button variant="ghost" onPress={handleToggleCompose} className="p-2 rounded-xl">
              <Bell size={22} color="#64748b" />
            </Button>
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
            <Input
              value={newAnnouncement}
              onChangeText={setNewAnnouncement}
              placeholder="部署連絡を入力してください..."
              multiline
              className="bg-muted rounded-xl p-3 min-h-[80px]"
            />
            <View className="flex-row gap-3">
              <Button 
                variant="outline" 
                onPress={handleCancelCompose}
                className="flex-1"
              >
                <Text>キャンセル</Text>
              </Button>
              <Button 
                onPress={handleSendAnnouncement}
                disabled={!canSend}
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
