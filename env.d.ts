// env.d.ts

declare module "@env" {
      export const EXPO_PUBLIC_SUPABASE_URL: string;
      export const EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    };

// React Native/Expo の process.env の型定義
declare let process: {
  env: {
    EXPO_PUBLIC_SUPABASE_URL?: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    [key: string]: string | undefined;
  };
};
   