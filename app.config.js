// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "GENBA",
    // EAS の projectId に紐づく Expo プロジェクト slug と完全一致（大文字小文字含む）
    slug: "Shift-chat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "genba",
    userInterfaceStyle: "automatic",
//new archtecture は書かない

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hiraki.shiftchat",
      infoPlist: {
        CFBundleDisplayName: "GENBA",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    // package は ios.bundleIdentifier と揃える（ストア・既存インストールの連続性のため）
    android: {
      package: "com.hiraki.shiftchat",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      // ルートの scheme: genba と一致。Supabase の genba://auth / genba://reset-password を届ける
      intentFilters: [
        {
          action: "VIEW",
          data: [
            { scheme: "genba", host: "auth" },
            { scheme: "genba", host: "reset-password" },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/logo.png",
    },
    plugins: [
      "expo-router",
      ["expo-splash-screen", { image: "./assets/images/logo.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff"}],
      "expo-font",
      "expo-web-browser",
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "af139760-23fd-4d1e-8a1a-58f685e7148c",
      },
    },
  },
};
