// app.config.js

import 'dotenv/config';

export default {
  expo: {
    name: "Shift-chat",
    slug: "Shift-chat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "shiftchat",
    userInterfaceStyle: "automatic",
    ios: { supportsTablet: true },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: { //bundler: "metro", output: "static", 
      bundler: "metro",
         favicon: "./assets/images/favicon.png" },
    plugins: [
      "expo-router",
      ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff"}],
      "expo-font",          // ← 追加
      "expo-web-browser",  
    ],
    //experiments: { typedRoutes: true },
    // ← 公開OKの値だけ。envから流す
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
