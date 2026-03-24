//search-page.tsx
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from '../types';
import { useSearchPageManagement } from "../src/hooks/useSearchPageManagement";
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
interface SearchPageProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function SearchPage({ user, onNavigate }: SearchPageProps) {
  const { state, data, utils, actions } = useSearchPageManagement(user);
  const { searchTerm, searchType, selectedShift, selectedSeverity, showFilters } = state;
  const { filteredResults } = data;
  const { getTypeIcon, getTypeText } = utils;
  const {
    setSearchTerm,
    setSearchType,
    setSelectedShift,
    setSelectedSeverity,
    toggleFilters,
  } = actions;


  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white-500 border-b border-gray-200">
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <Button variant="ghost" onPress={() => onNavigate('index')} className="p-2 rounded-lg">
                ←
              </Button>
              <View>
                <Text className="text-xl font-semibold text-gray-900">検索・履歴</Text>
                <Text className="text-sm text-gray-500">{user.department}</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-2">
              <Button variant="outline" size="sm" onPress={toggleFilters}>
                <Text className="mr-2">🔧</Text>
                <Text>フィルター</Text>
              </Button>
              {filteredResults.length > 0 && (
                <Button variant="outline" size="sm">
                  <Text className="mr-2">📥</Text>
                  <Text>エクスポート</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className="p-4 space-y-6">
        {/* 検索バー */}
        <Card>
          <View className="space-y-4">
            <View className="relative">
              <View className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Text className="text-gray-400 text-lg">🔍</Text>
              </View>
              <Input
                placeholder="キーワードを入力して検索..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                className="pl-10"
              />
            </View>
            
            <ResponsiveGrid maxCols={{ sm:3, md:3, lg:3, xl:3, "2xl":3 }}>
              {[
                { value: 'all', label: 'すべて' },
                { value: 'incident', label: '異常報告' },
                { value: 'announcement', label: '部署連絡' }
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={searchType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onPress={() => setSearchType(type.value as "all" | "incident" | "announcement")}
                >
                  {type.label}
                </Button>
              ))}
            </ResponsiveGrid>
          </View>
        </Card>

        {/* 詳細フィルター */}
        {showFilters && (
          <Card>
            <View className="mb-4">
              <Text className="text-base font-semibold">詳細フィルター</Text>
            </View>
            <View className="space-y-4">
              <View className="space-y-2">
                <Label>勤務帯</Label>
                <ResponsiveGrid maxCols={{ sm:4, md:4, lg:4, xl:4, "2xl":4 }}>
                  {[
                    { value: 'all', label: 'すべて' },
                    { value: '1勤', label: '1勤' },
                    { value: '2勤', label: '2勤' },
                    { value: '3勤', label: '3勤' }
                  ].map((shift) => (
                    <Button
                      key={shift.value}
                      variant={selectedShift === shift.value ? 'default' : 'outline'}
                      size="sm"
                      onPress={() => setSelectedShift(shift.value as any)}
                    >
                      {shift.label}
                    </Button>
                  ))}
                </ResponsiveGrid>
              </View>
              <View className="space-y-2">
                <Label>重要度</Label>
                <ResponsiveGrid maxCols={{ sm:4, md:4, lg:4, xl:4, "2xl":4 }}>
                  {[
                    { value: 'all', label: 'すべて' },
                    { value: 'low', label: '低' },
                    { value: 'medium', label: '中' },
                    { value: 'high', label: '高' }
                  ].map((severity) => (
                    <Button
                      key={severity.value}
                      variant={selectedSeverity === severity.value ? 'default' : 'outline'}
                      size="sm"
                      onPress={() => setSelectedSeverity(severity.value as 'all' | 'low' | 'medium' | 'high')}
                    >
                      {severity.label}
                    </Button>
                  ))}
                </ResponsiveGrid>
              </View>
            </View>
          </Card>
        )}

        {/* 検索結果 */}
        <View className="space-y-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">
              検索結果 ({filteredResults.length}件)
            </Text>
          </View>

          {filteredResults.map((item) => (
            <Card key={item.id}>
              <View className="flex-row items-start space-x-3">
                <View className="flex-shrink-0">
                  <Text className="text-gray-500 text-lg">{getTypeIcon(item.type)}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center space-x-2 mb-1">
                        <Text className="font-medium text-gray-900">{item.title}</Text>
                        <Badge variant="outline">
                          {getTypeText(item.type)}
                        </Badge>
                      </View>
                      
                      <Text className="text-sm text-gray-700 mb-2">{item.content}</Text>
                      
                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center space-x-1">
                          <Text className="text-gray-500 text-lg">👤</Text>
                          <Text className="text-xs text-gray-500">{item.author}</Text>
                        </View>
                        <View className="flex-row items-center space-x-1">
                          <Text className="text-gray-500 text-lg">⏰</Text>
                          <Text className="text-xs text-gray-500">{item.createdAt}</Text>
                        </View>
                        {'shift' in item && item.shift && (
                          <Badge variant="secondary">
                            {item.shift}
                          </Badge>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          ))}

          {filteredResults.length === 0 && (
            <Card>
              <View className="text-center py-8">
                <Text className="text-gray-400 text-6xl mb-4">🔍</Text>
                <Text className="text-gray-500">
                  {searchTerm ? '検索条件に一致する結果が見つかりません。' : 'キーワードを入力して検索してください。'}
                </Text>
              </View>
            </Card>
          )}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
