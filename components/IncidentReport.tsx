//incident-report.tsx
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Incident, Shift, User } from '../types';
import { FileText, MessageCircle } from './ui/icons';
//import { supabase } from '@/lib/supabase';

// 異常報告画面 Props
interface IncidentReportProps {
  user: User;
  selectedShift: Shift;
  onNavigate: (page: string) => void;
}

export function IncidentReport({ user, selectedShift, onNavigate }: IncidentReportProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [shift, setShift] = useState<Shift>(selectedShift);
  const [occurredAt, setOccurredAt] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExistingReports, setShowExistingReports] = useState(false);

  // モック既存レポート
  const existingReports: Incident[] = [
    {
      id: '1',
      title: '機械異常音発生',
      description: 'ライン2の機械から異常音が発生しています。すぐに点検が必要です。',
      severity: 'high',
      status: 'open',
      shift: '2勤' as Shift,
      department: user.department,
      reportedBy: '作業者A',
      reportedAt: '2024-12-20 14:30',
      photos: [],
      comments: []
    },
    {
      id: '2',
      title: '品質チェック要注意',
      description: '製品の寸法に若干のばらつきが見られます。',
      severity: 'medium',
      status: 'in_progress',
      shift: '1勤' as Shift,
      department: user.department,
      reportedBy: '検査員B',
      reportedAt: '2024-12-20 10:15',
      photos: [],
      comments: []
    }
  ];

  const handlePhotoUpload = () => {
    // React Nativeでは画像選択ライブラリを使用
    console.log('写真アップロード機能');
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
  
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const newReport: Incident = {
      id: Date.now().toString(),
      title,
      description,
      severity,
      status: 'open',
      shift,
      department: user.department,
      reportedBy: user.displayName,
      reportedAt: new Date().toISOString(),
      photos,
      comments: []
    };

    console.log('新しい異常報告:', newReport);

    setTimeout(() => {
      setIsSubmitting(false);
      setTitle('');
      setDescription('');
      setSeverity('medium');
      setPhotos([]);
      setOccurredAt('');
      Alert.alert('送信完了', '異常報告が送信されました');
    }, 1000);
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (sev: string) => {
    switch (sev) {
      case 'high': return '緊急';
      case 'medium': return '重要';
      case 'low': return '軽微';
      default: return '不明';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '未対応';
      case 'in_progress': return '対応中';
      case 'resolved': return '解決';
      case 'closed': return '完了';
      default: return '不明';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  const generatePDF = (report: Incident) => {
    console.log('PDF生成:', report);
    Alert.alert('PDF生成', `"${report.title}" のPDFを生成しました`);
  };

  // シンプルなUIラッパ
  const Card = ({ children, className = "" }: any) => (
    <View className={`bg-card/80 rounded-2xl border border-border p-4 ${className}`}>
      {children}
    </View>
  );

  // ✅ 安全な Button 実装（children を Text で包まない）
  const Button = ({
    children,
    onPress,
    variant = "default",
    className = "",
    disabled = false,
  }: any) => {
    const base = "rounded-xl px-4 py-3 items-center justify-center flex-row";
    const variantStyle =
      variant === "outline"     ? "border border-border bg-transparent" :
      variant === "destructive" ? "bg-red-500" :
      variant === "secondary"   ? "bg-muted" :
      variant === "ghost"       ? "bg-transparent" :
      "bg-blue-500";
    const disabledStyle = disabled ? "opacity-50" : "";
    const textColor =
      variant === "outline" || variant === "ghost" || variant === "secondary"
        ? "text-foreground"
        : "text-white";

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={[base, variantStyle, disabledStyle, className].join(" ")}
      >
        {typeof children === "string"
          ? <Text className={`${textColor} text-base font-medium`}>{children}</Text>
          : children}
      </TouchableOpacity>
    );
  };

  const Badge = ({ children, variant = "secondary", className = "" }: any) => (
    <View className={`px-2 py-1 rounded-md ${
      variant === "secondary" ? "bg-muted" :
      variant === "destructive" ? "bg-red-500" :
      variant === "outline" ? "border border-border bg-transparent" :
      "bg-primary"
    } ${className}`}>
      <Text className={`text-xs font-medium ${
        variant === "outline" || variant === "secondary" ? "text-foreground" : "text-white"
      }`}>
        {children}
      </Text>
    </View>
  );

  const Input = ({ value, onChangeText, placeholder, multiline = false, rows = 1 }: any) => (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      numberOfLines={multiline ? rows : 1}
      className="border border-border rounded-lg px-3 py-2 text-foreground bg-background"
      placeholderTextColor="#6b7280"
    />
  );

  const Label = ({ children, className = "" }: any) => (
    <Text className={`text-sm font-medium text-foreground mb-2 ${className}`}>
      {children}
    </Text>
  );

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
                            <Badge variant={getStatusColor(report.status)}>
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
                          onPress={() => generatePDF(report)}
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
                      rows={4}
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
                  onPress={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !description.trim()}
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
