//incident-report.tsx
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Shift, User } from '../types';
import { useIncidentReportManagement } from "../src/hooks/useIncidentReportManagement";
import { FileText, MessageCircle } from './ui/icons';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
//import { supabase } from "@/lib/supabase";

// 異常報告画面 Props
interface IncidentReportProps {
  user: User;
  selectedShift: Shift;
  onNavigate: (page: string) => void;
}

export function IncidentReport({ user, selectedShift, onNavigate }: IncidentReportProps) {
  const { state, data, derived, utils, actions } = useIncidentReportManagement(user, selectedShift);
  const { title, description, severity, shift, occurredAt, photos, isSubmitting, showExistingReports } = state;
  const { existingReports } = data;
  const { canSubmit } = derived;
  const { getSeverityColor, getSeverityText, getStatusText, getStatusBadgeVariant } = utils;
  const {
    setTitle,
    setDescription,
    setSeverity,
    setShift,
    setOccurredAt,
    setShowExistingReports,
    handlePhotoUpload,
    removePhoto,
    handleSubmit,
    generatePDF,
  } = actions;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-background">
        {/* ヘッダー */}
        <View className="bg-emerald-500 shadow-sm border-b border-emerald-700">
          <View className="px-4">
            <View className="flex-row items-center justify-between h-16">
              <View className="flex-row items-center">
                <Button
                  variant="ghost"
                  onPress={() => onNavigate('index')}
                  className="p-2"
                >
                  <Text>←</Text>
                </Button>
                <View className="ml-3">
                  <Text className="text-xl font-semibold text-foreground">異常報告</Text>
                  <Text className="text-sm text-muted-foreground">{user?.department ?? '—'} - {selectedShift}</Text>
                </View>
              </View>
              <Button
                variant="outline"
                onPress={() => setShowExistingReports(!showExistingReports)}
              >
                {showExistingReports ? '新規作成' : '既存報告'}
              </Button>
            </View>
          </View>
        </View>

        <View className="px-4 py-6">
          {showExistingReports ? (
            // 既存報告一覧
            <View className="gap-4">
              <Text className="text-lg font-semibold mb-2">既存の異常報告</Text>
              {existingReports.map((report) => (
                <Card key={report.id}>
                  <View className="pb-3">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-row items-center">
                        <View className={`w-4 h-4 rounded-full ${getSeverityColor(report.severity)}`} />
                        <View className="ml-3">
                          <Text className="text-lg font-semibold">{report.title}</Text>
                          <View className="flex-row items-center mt-1">
                            <Badge variant={getStatusBadgeVariant(report.status)}>
                              {getStatusText(report.status)}
                            </Badge>
                            <View className="w-2" />
                            <Badge variant="outline">{getSeverityText(report.severity)}</Badge>
                            <View className="w-2" />
                            <Badge variant="secondary">{report.shift}</Badge>
                          </View>
                        </View>
                      </View>
                      <View className="flex-row">
                        <Button
                          variant="outline"
                          onPress={() => {
                            const res = generatePDF(report);
                            Alert.alert(res.title, res.message);
                          }}
                          className="px-3 py-2"
                        >
                          <FileText size={16} color="#374151" />
                          <Text className="ml-1 text-foreground">PDF</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text className="text-foreground mb-3">{report.description}</Text>
                    <View className="flex-row items-center">
                      <View className="flex-row items-center">
                        <Text>👤</Text>
                        <Text className="text-sm text-muted-foreground ml-1">{report.reportedBy}</Text>
                      </View>
                      <View className="w-4" />
                      <View className="flex-row items-center">
                        <Text>🕐</Text>
                        <Text className="text-sm text-muted-foreground ml-1">
                          {new Date(report.reportedAt).toLocaleString('ja-JP')}
                        </Text>
                      </View>
                      <View className="w-4" />
                      <View className="flex-row items-center">
                        <MessageCircle size={16} color="#6B7280" />
                        <Text className="text-sm text-muted-foreground ml-1">{report.comments.length} コメント</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            // 新規報告フォーム
            <View className="gap-6">
              <Card>
                <View className="mb-4">
                  <Text className="text-xl font-semibold">新しい異常報告</Text>
                </View>
                <View className="gap-4">
                  <View className="flex-row">
                    <View className="flex-1 mr-2">
                      <Label>タイトル *</Label>
                      <Input
                        value={title}
                        onChangeText={setTitle}
                        placeholder="異常の概要等を入力"
                      />
                    </View>
                    <View className="flex-1 ml-2">
                      <Label>発生日時</Label>
                      <Input
                        value={occurredAt}
                        onChangeText={setOccurredAt}
                        placeholder="勤務帯、時刻、日付"
                      />
                    </View>
                  </View>

                  <View>
                    <Label>詳細内容 *</Label>
                    <Input
                      value={description}
                      onChangeText={setDescription}
                      placeholder="異常の詳細、発生場所、状況などを詳しく記入してください"
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>

                  <View className="flex-row">
                    <View className="flex-1 mr-2">
                      <Label>重大度 *</Label>
                      <View className="flex-row">
                        {(['low', 'medium', 'high'] as const).map((sev) => (
                          <Button
                            key={sev}
                            variant={severity === sev ? 'default' : 'outline'}
                            onPress={() => setSeverity(sev)}
                            className="flex-1 mr-2"
                          >
                            <View className={`w-3 h-3 rounded-full mr-2 ${getSeverityColor(sev)}`} />
                            <Text>{getSeverityText(sev)}</Text>
                          </Button>
                        ))}
                      </View>
                    </View>
                    <View className="flex-1 ml-2">
                      <Label>勤務帯 *</Label>
                      <View className="flex-row">
                        {(['1勤', '2勤', '3勤'] as const).map((s) => (
                          <Button
                            key={s}
                            variant={shift === s ? 'default' : 'outline'}
                            onPress={() => setShift(s)}
                            className="flex-1 mr-2"
                          >
                            <Text>{s}</Text>
                          </Button>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View>
                    <Label>写真添付</Label>
                    <View className="gap-3">
                      <View className="flex-row items-center">
                        <Button
                          variant="outline"
                          onPress={handlePhotoUpload}
                          className="flex-row items-center px-3 py-2"
                        >
                          <Text>📷</Text>
                          <Text className="ml-2">写真を追加 ({photos.length}/10)</Text>
                        </Button>
                      </View>
                      {photos.length > 0 && (
                        <View className="flex-row flex-wrap">
                          {photos.map((photo, index) => (
                            <View key={index} className="relative" style={{ width: '30%', marginRight: '3.333%', marginBottom: 12 }}>
                              <Image
                                source={{ uri: photo }}
                                className="w-full h-24 rounded-lg border"
                                resizeMode="cover"
                              />
                              <Button
                                variant="destructive"
                                onPress={() => removePhoto(index)}
                                className="absolute -top-2 -right-2 h-6 w-6 items-center justify-center p-0"
                              >
                                <Text className="text-white">✕</Text>
                              </Button>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Card>

              <View className="p-4 bg-white rounded-lg">
                <Text className="text-foreground">
                  報告送信後、関係者に通知が送信されます。緊急度が高い場合は、直接連絡も行ってください。
                </Text>
              </View>

              <View className="flex-row">
                <Button
                  variant="outline"
                  onPress={() => onNavigate('index')}
                  className="flex-1 mr-2"
                >
                  キャンセル
                </Button>
                <Button
                  onPress={async () => {
                    const res = await handleSubmit();
                    Alert.alert(res.title, res.message);
                  }}
                  disabled={isSubmitting || !canSubmit}
                  className="flex-1 ml-2"
                >
                  {isSubmitting ? '送信中...' : '異常報告を送信'}
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
