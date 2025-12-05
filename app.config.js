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
//new archtecture は書かない

    ios: { 
      supportsTablet: true ,
    bundleIdentifier: "com.hiraki.shiftchat",
    infoPlist: {
  ITSAppUsesNonExemptEncryption: false
    }
},
    android: {
      package: "com.hiraki.shiftchat",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff"}],
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
