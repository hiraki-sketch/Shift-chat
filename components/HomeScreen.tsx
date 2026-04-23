// app/HomeScreen.tsx
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";
import { Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResponsiveGrid } from "./layout/ResponsiveGrid";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface HomeScreenProps {
  onNavigate: (page: string) => void;
}

type FadeDirection = "up" | "down" | "left" | "right";

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const features = [
    {
      icon: "💬",
      title: "リアルタイムチャット",
      description:
        "勤務帯別・部署別のチャット機能で、円滑なコミュニケーションを実現",
    },
    {
      icon: "🛡️",
      title: "異常報告システム",
      description:
        "写真添付可能な異常報告機能で、迅速な問題対応をサポート",
    },
    {
      icon: "📅",
      title: "勤務管理",
      description:
        "シフト表、出勤管理、有給申請まで一元化された勤務管理機能",
    },
    {
      icon: "⏰",
      title: "24時間対応",
      description:
        "3交代制に完全対応、いつでも安心してご利用いただけます",
    },
    {
      icon: "👥",
      title: "部署連携",
      description:
        "部署をまたいだ情報共有で、組織全体の効率性を向上",
    },
    {
      icon: "⚡",
      title: "高速検索",
      description:
        "過去の報告や会話を素早く検索、必要な情報にすぐアクセス",
    },
  ];

  const benefits = [
    "引き継ぎ業務の効率化",
    "異常事象の早期発見・対応",
    "勤務状況の把握",
    "ペーパーレス化の推進",
    "コミュニケーション品質の向上",
    "業務標準化の促進",
  ];

  const stats = [
    {  label: "サポート", description: "安心サポート" },
    { number: "3勤", label: "対応", description: "交代勤務チャット" },
  ];

  // ---- Scroll アニメ用の共有値 ----
  const { height: windowHeight } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // 「スクロールして見えたタイミングでフェードイン」するラッパー
  const FadeInOnScroll = ({
    children,
    index,
    offset = 0,
    className = "",
    direction = "down", // ← デフォルトを「上からスライド」にしておく
  }: {
    children: React.ReactNode;
    index: number; // 画面内の大まかな順番（1,2,3...みたいなイメージ）
    offset?: number;
    className?: string;
    direction?: FadeDirection;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      // どのスクロール位置でアニメ開始/終了させるかざっくり決める
      const rawStart = windowHeight * 0.5 * index + offset;
      const start = Math.max(0, rawStart);
      const end = start + windowHeight * 0.5;

      const opacity = interpolate(
        scrollY.value,
        [start, end],
        [0, 1],
        Extrapolate.CLAMP
      );

      const distance = 30; // スライド量（px）
      let translateX = 0;
      let translateY = 0;

      switch (direction) {
        case "up":
          // 下から上へ
          translateY = interpolate(
            scrollY.value,
            [start, end],
            [distance, 0],
            Extrapolate.CLAMP
          );
          break;
        case "down":
          // 上から下へ
          translateY = interpolate(
            scrollY.value,
            [start, end],
            [-distance, 0],
            Extrapolate.CLAMP
          );
          break;
        case "left":
          // 右から左へ
          translateX = interpolate(
            scrollY.value,
            [start, end],
            [distance, 0],
            Extrapolate.CLAMP
          );
          break;
        case "right":
          // 左から右へ
          translateX = interpolate(
            scrollY.value,
            [start, end],
            [-distance, 0],
            Extrapolate.CLAMP
          );
          break;
      }

      return {
        opacity,
        transform: [{ translateX }, { translateY }],
      };
    });

    return (
      <Animated.View style={animatedStyle} className={className}>
        {children}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <Animated.ScrollView
        className="flex-1 bg-slate-50"
        showsVerticalScrollIndicator={false}
        bounces
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]} // ← 最初の子（ヘッダー）を固定
        onScroll={onScroll}
      >
        {/* ===== ヘッダー（Sticky） ===== */}
        <View className="bg-white-500 border-b border-slate-200">
          <View className="px-5 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center mr-2">
                  <Text className="text-white text-lg">🏭</Text>
                </View>
                <Text className="text-xl font-bold text-slate-800">
                  GENBA
                </Text>
              </View>
              <View className="flex-row">
                <Button
                  variant="outline"
                  onPress={() => onNavigate("login")}
                  className="mr-3 rounded-xl border-slate-300"
                >
                  ログイン
                </Button>
                <Button
                  variant="default"
                  onPress={() => onNavigate("signup")}
                  className="bg-green-500"
                >
                  サインアップ
                </Button>
              </View>
            </View>
          </View>
        </View>

        {/* ===== ヒーロー（LinearGradient 使用） ===== */}
        <LinearGradient
          colors={["#3b82f6", "#eff6ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="py-14 px-5 items-center">
           
              <Badge className="mb-2">交代勤務用チャットツール</Badge>
           

         
              <Text className="text-3xl font-bold text-slate-800 mb-4 text-center">
                GENBAの交代勤務における
                <Text className="text-blue-600"> 
                コミュニケーション </Text>
                を革新
              </Text>
            

           
              <Text className="text-base text-slate-600 mb-8 text-center">
                工場などのGENBAにおける交代勤務の連絡・異常報告に使えます。
              </Text>
       

           
              <Button
                onPress={() => onNavigate("login")}
                className="h-14 px-10"
              >
                今すぐ始める →
              </Button>
        

            {/* 統計（flex + wrap） */}
            <View className="mt-10 w-full flex-row flex-wrap px-1">
              {stats.map((stat, i) => (
                <FadeInOnScroll
                  key={i}
                  index={0.2 + i * 0.05}
                  className="w-1/2 p-2"
                  direction="down"
                >
                  <View className="items-center p-5 bg-white-500/80 rounded-xl">
                    <Text className="text-3xl font-bold text-blue-600 mb-1">
                      {stat.number}
                    </Text>
                    <Text className="text-sm font-medium text-slate-800 mb-1">
                      {stat.label}
                    </Text>
                    <Text className="text-xs text-slate-600">
                      {stat.description}
                    </Text>
                  </View>
                </FadeInOnScroll>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* ===== 機能紹介（flex + wrap） ===== */}
        <View className="py-14 px-5 bg-slate-50">
          <FadeInOnScroll index={1} className="items-center mb-10" direction="down">
            <Text className="text-2xl font-bold text-slate-800 mb-2">
              交代勤務に特化した機能
            </Text>
            <Text className="text-base text-slate-600 text-center">
              GENBAの実際のワークフローに合わせた機能
            </Text>
          </FadeInOnScroll>

          <ResponsiveGrid
            maxCols={{ sm: 1, md: 2, lg: 3, xl: 3, "2xl": 3 }}
          >
            {features.map((feature, idx) => (
              <FadeInOnScroll
                key={idx}
                index={1.1 + idx * 0.15}
                className="p-2"
                direction={idx % 2 === 0 ? "left" : "right"}
              >
                <Card>
                  <View className="w-full">
                    <View className="flex-row items-center mb-3">
                      <View className="w-14 h-14 bg-slate-100 rounded-lg items-center justify-center mr-3">
                        <Text className="text-3xl">{feature.icon}</Text>
                      </View>
                      <Text className="text-lg text-slate-800 font-semibold">
                        {feature.title}
                      </Text>
                    </View>
                    <Text className="text-slate-600">
                      {feature.description}
                    </Text>
                  </View>
                </Card>
              </FadeInOnScroll>
            ))}
          </ResponsiveGrid>
        </View>

        {/* ===== 利用効果 ===== */}
       {/* ===== 利用効果 ===== */}
<View className="py-14 px-5 bg-white">
  <View className="flex-col lg:flex-row">
    {/* 見出し＋説明文だけ全体でふわっと */}
    <FadeInOnScroll index={2} className="mb-8" direction="down">
      <Text className="text-2xl font-bold text-slate-800 mb-4">
        導入効果
      </Text>
      <Text className="text-base text-slate-600 mb-6">
        交代勤務チャットの導入により、GENBAの業務効率化
        ペーパーレス化、リアルタイムで情報共有できる環境へ。
      </Text>
    </FadeInOnScroll>

    {/* ★ チェックリスト：テキストは常に表示、チェックだけ順番にアニメ ★ */}
    <View className="mb-8">
      {benefits.map((b, i) => (
        <View key={i} className="flex-row items-center mb-3">
          {/* チェックマークだけをアニメーションさせる */}
          <FadeInOnScroll
            index={2.1 + i * 0.1}   // 行ごとに少しずつ遅らせる
            direction="left"         // 左からニュッと出てくる
          >
            <Text className="text-green-600 text-xl mr-2">✓</Text>
          </FadeInOnScroll>

          {/* テキストは静的に表示 */}
          <Text className="text-slate-700">{b}</Text>
        </View>
      ))}
    </View>

    {/* ここから下は今まで通り（KPIカード） */}
    <FadeInOnScroll index={2.5} direction="left">
      <Card className="p-6">
        <View className="items-center">
          <Text className="text-5xl font-bold text-blue-600 mb-2">
            
          </Text>
          <Text className="text-base font-medium text-slate-800 mb-1">
            業務効率向上
          </Text>
          <Text className="text-xs text-slate-600 mb-5">
            
          </Text>

          <ResponsiveGrid
            maxCols={{ sm: 2, md: 2, lg: 2, xl: 2, "2xl": 2 }}
          >
            {[
              {
                value: "70%",
                label: "引き継ぎ時間短縮目標",
                color: "text-blue-600",
              },
              {
                value: "85%",
                label: "異常対応速度向上目標",
                color: "text-emerald-600",
              },
              {
                value: "60%",
                label: "ペーパーレス化目標",
                color: "text-amber-600",
              },
              {
                value: "90%",
                label: "ユーザー満足度目標",
                color: "text-rose-600",
              },
            ].map((s, i) => (
              <FadeInOnScroll
                key={i}
                index={2.7 + i * 0.1}
                className="p-2"
                direction="left"
              >
                <View className="items-center p-3 bg-white/80 rounded-lg">
                  <Text className={`text-2xl font-bold mb-1 ${s.color}`}>
                    {s.value}
                  </Text>
                  <Text className="text-xs text-slate-600">
                    {s.label}
                  </Text>
                </View>
              </FadeInOnScroll>
            ))}
          </ResponsiveGrid>
        </View>
      </Card>
    </FadeInOnScroll>
  </View>
</View>


        {/* ===== CTA（LinearGradient 使用） ===== */}
        <LinearGradient
          colors={["#3b82f6", "#2563eb", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FadeInOnScroll
            index={3}
            className="py-14 px-5 items-center"
            direction="left"
          >
            <Text className="text-2xl font-bold text-white mb-3">
              今すぐ始めて、GENBAの生産性を向上させましょう
            </Text>
            <Text className="text-base text-blue-100 mb-6">
              無料トライアルで交代勤務チャットの効果を実感してください
            </Text>
            <View className="flex-row">
              <Button
                variant="secondary"
                className="h-12 px-8 mr-3"
                onPress={() => onNavigate("login")}
              >
                無料で始める
              </Button>
              <Button variant="secondary" className="h-12 px-8">
                使い方の説明と資料請求
              </Button>
            </View>
          </FadeInOnScroll>
        </LinearGradient>

        {/* ===== フッター ===== */}
        <FadeInOnScroll
          index={3.5}
          className="bg-slate-50 py-12 px-5 border-t border-slate-200"
          direction="left"
        >
          <View>
            <View className="flex-row mb-4 items-center">
              <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center mr-2">
                <Text className="text-white text-lg">🏭</Text>
              </View>
              <Text className="text-xl font-bold text-slate-800">
                GENBA
              </Text>
            </View>
            <Text className="text-slate-600 mb-4">
              製造業のGENBAにおける交代勤務に特化したコミュニケーションツール。安全で効率的なGENBA運営をサポートします。
            </Text>

            <View className="flex-row">
              <View className="mr-8">
                <Text className="font-medium mb-2 text-slate-800">
                  機能
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                  リアルタイムチャット
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                  異常報告システム
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                  勤務管理
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                  履歴検索
                </Text>
              </View>
              <View>
                <Text className="font-medium mb-2 text-slate-800">
                
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                  
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                  
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                
                </Text>
                <Text className="text-sm text-slate-600 mb-1">
                
                </Text>
              </View>
            </View>

            <View className="border-t border-slate-200 mt-8 pt-6 items-center">
              <Text className="text-sm text-slate-500">
                © 2026 GENBA. All rights reserved.
              </Text>
            </View>
          </View>
        </FadeInOnScroll>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
