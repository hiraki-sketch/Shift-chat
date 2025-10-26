//search-page.tsx
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Shift, User } from '../types';
interface SearchPageProps {
  user: User;
  onNavigate: (page: string) => void;
}

type SearchType = 'all' | 'incident' | 'announcement';

export function SearchPage({ user, onNavigate }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [selectedShift, setSelectedShift] = useState<Shift | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // モック検索結果
  const searchResults = [
    {
      id: '1',
      type: 'incident' as const,
      title: '機械異常音発生',
      content: 'ライン2の機械から異常音が発生しています。すぐに点検が必要です。',
      severity: 'high' as const,
      status: 'open' as const,
      shift: '2勤' as Shift,
      author: '作業者A',
      createdAt: '2024-12-20 14:30',
      department: user.department
    },
    {
      id: '2',
      type: 'announcement' as const,
      title: '来週の保守点検について',
      content: '来週月曜日から水曜日まで、機械の定期保守点検を実施します。',
      author: '保守担当 佐藤',
      createdAt: '2024-12-20 16:00',
      department: user.department
    }
  ];

  const filteredResults = searchResults.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = searchType === 'all' || item.type === searchType;
    const matchesShift = selectedShift === 'all' || 
      ('shift' in item && item.shift === selectedShift);
    const matchesSeverity = selectedSeverity === 'all' || 
      ('severity' in item && item.severity === selectedSeverity);
    
    return matchesSearch && matchesType && matchesShift && matchesSeverity;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incident': return <Text className="text-red-500 text-lg">🚨</Text>;
      case 'announcement': return <Text className="text-blue-500 text-lg">📢</Text>;
      default: return <Text className="text-gray-500 text-lg">🔍</Text>;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'incident': return '異常報告';
      case 'announcement': return '部署連絡';
      default: return '不明';
    }
  };

  // シンプルなUIラッパ
  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {children}
    </View>
  );

  const Button = ({ children, onPress, variant = "default", size = "default", className = "" }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={[
        "rounded-lg px-3 py-2 items-center justify-center",
        size === "sm" ? "px-2 py-1" : "px-3 py-2",
        variant === "outline" ? "border border-gray-300 bg-transparent" : "",
        variant === "ghost" ? "bg-transparent" : "",
        variant === "default" ? "bg-blue-600" : "",
        className,
      ].join(" ")}
    >
      <Text className={`${
        variant === "default" ? "text-white" : "text-gray-700"
      } text-sm font-medium`}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  const Input = ({ value, onChangeText, placeholder, className = "" }: any) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white ${className}`}
      placeholderTextColor="#9ca3af"
    />
  );

  const Badge = ({ children, variant = "secondary", className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${variant === "secondary" ? "bg-gray-100" : "bg-gray-200"} ${className}`}>
      <Text className="text-xs text-gray-700 font-medium">
        {children}
      </Text>
    </View>
  );

  const Label = ({ children, className = "" }: any) => (
    <Text className={`text-sm font-medium text-gray-700 mb-2 ${className}`}>
      {children}
    </Text>
  );

  return (
    <SafeAreaView className="flex-1">
    <ScrollView className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white-500 border-b border-gray-200">
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => onNavigate('index')}
                className="p-2 rounded-lg"
              >
                <Text className="text-2xl">←</Text>
              </TouchableOpacity>
              <View>
                <Text className="text-xl font-semibold text-gray-900">検索・履歴</Text>
                <Text className="text-sm text-gray-500">{user.department}</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-2">
              <Button variant="outline" size="sm" onPress={() => setShowFilters(!showFilters)}>
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
                  onPress={() => setSearchType(type.value as SearchType)}
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
                  {getTypeIcon(item.type)}
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
