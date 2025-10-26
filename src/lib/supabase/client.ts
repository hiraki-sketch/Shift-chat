// lib/supabase/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// app.config.js の extra は { supabaseUrl, supabaseAnonKey }
const extra = (Constants.expoConfig?.extra ?? {}) as any;

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl;

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Set EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // WebはlocalStorageを使わせる / ネイティブだけAsyncStorage
    ...(Platform.OS === 'web'
      ? {}
      : { storage: AsyncStorage, detectSessionInUrl: false }),
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ※ デバッグログでキー本体は出さないこと！必要なら存在フラグだけ：
// console.log('[ENV URL]', !!process.env.EXPO_PUBLIC_SUPABASE_URL, '[extra]', !!extra.supabaseUrl);

