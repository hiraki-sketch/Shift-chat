# Dashboard コンポーネント

このプロジェクトは、Vite + React + Tailwindで書かれたUIをExpo/React Native + NativeWindに変換したものです。

## 変換されたコンポーネント

### 主要な変更点

1. **HTML要素 → React Nativeコンポーネント**
   - `div` → `View`
   - `span`, `p` → `Text`
   - `button` → `Pressable` (Buttonコンポーネント内で使用)

2. **イベントハンドラー**
   - `onClick` → `onPress`

3. **スタイリング**
   - `className`はそのままNativeWind形式で使用可能
   - Tailwind CSSのクラスがそのまま適用。

4. **アイコン**
   - Lucide Reactアイコンを絵文字ベースのアイコンに変換
   - 必要に応じて`@expo/vector-icons`や`react-native-vector-icons`に置き換え可能

## 使用方法

### 1. 基本的な使用

```tsx
import { Dashboard } from './components/Dashboard';
import { User, Shift } from './types';

const user: User = {
  id: '1',
  displayName: '田中太郎',
  department: '製造部',
  email: 'tanaka@example.com'
};

function App() {
  const [selectedShift, setSelectedShift] = useState<Shift>('1勤');

  const handleShiftChange = (shift: Shift) => {
    setSelectedShift(shift);
  };

  const handleNavigate = (page: string) => {
    // expo-routerを使用したナビゲーション
    router.push(`/${page}`);
  };

  return (
    <Dashboard
      user={user}
      selectedShift={selectedShift}
      onShiftChange={handleShiftChange}
      onNavigate={handleNavigate}
    />
  );
}
```

### 2. expo-routerとの統合

```tsx
import { useRouter } from 'expo-router';

function DashboardWithRouter() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  // ... その他のコード
}
```

## 必要な依存関係

```json
{
  "dependencies": {
    "nativewind": "^2.0.0",
    "react-native": "^0.79.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0"
  }
}
```

## 設定ファイル

### tailwind.config.js
```js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### babel.config.js
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

### app.d.ts
```typescript
/// <reference types="nativewind/types" />
```

## カスタマイズ

### アイコンの変更

現在は絵文字ベースのアイコンを使用していますが、以下のように変更できます：

```tsx
// @expo/vector-iconsを使用する場合
import { Ionicons } from '@expo/vector-icons';

export function Search({ size = 24, color = 'currentColor' }: IconProps) {
  return <Ionicons name="search" size={size} color={color} />;
}
```

### スタイルの調整

NativeWindを使用して、Tailwind CSSのクラスをそのまま使用できます：

```tsx
<View className="bg-blue-500 p-4 rounded-lg">
  <Text className="text-white font-bold">カスタムスタイル</Text>
</View>
```

## 注意事項

1. **レスポンシブデザイン**: `grid-cols-2 md:grid-cols-4`などのレスポンシブクラスは、React Nativeでは異なる動作をする場合があります。

2. **スペーシング**: `space-x-4`などのスペーシングクラスは、React Nativeでは`gap`プロパティを使用することをお勧めします。

3. **シャドウ**: `shadow-sm`などのシャドウクラスは、プラットフォーム固有の実装が必要な場合があります。

## トラブルシューティング

### NativeWindが動作しない場合

1. Babel設定を確認
2. TypeScript設定を確認
3. 依存関係の再インストール

```bash
npm install
npx expo start --clear
```

### スタイルが適用されない場合

1. `className`プロパティが正しく設定されているか確認
2. Tailwind設定ファイルの`content`パスを確認
3. 開発サーバーの再起動

