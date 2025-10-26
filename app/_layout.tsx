//app/_layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="attendance" options={{ headerShown: false }} />
        <Stack.Screen name="chat-threads" options={{ headerShown: false }} />
        <Stack.Screen name="create-chat" options={{ headerShown: false }} />
        <Stack.Screen name="incident-report" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="vacation" options={{ headerShown: false }} />
        <Stack.Screen name="work-schedule" options={{ headerShown: false }} />
        <Stack.Screen name="department-chat" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
