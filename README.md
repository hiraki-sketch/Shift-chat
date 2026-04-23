# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## ヘッダーコンポーネント運用ルール

### 目的
- アプリ内画面のヘッダー挙動と見た目を統一する。
- レイアウトの重複実装を減らし、将来のデザイン変更を安全にする。

### 基本ルール
- 通常のアプリ内画面では `components/ui/AppHeader` を使用する。
- 戻る動作は `onBack` で渡す。
- 画面固有アクション（例: `新規作成`、`フィルター`、`ログアウト`）は `rightSlot` で渡す。

### 例外ルール
- 認証画面（`Login`、`Auth`、`ResetPassword`）には `AppHeader` を強制しない。
- 全画面専用デザインやモーダル専用ヘッダーなどの特殊画面には `AppHeader` を強制しない。

### `HeaderBackButton` について
- `HeaderBackButton` は現在も使用している。
- 各画面ファイルで `HeaderBackButton` を直接配置するのは原則避ける。
- `AppHeader` の内部で `HeaderBackButton` を利用し、戻る操作を統一する。

### 新規画面チェックリスト
- 通常のアプリ内画面か？ -> `AppHeader` を使う。
- 認証画面・特殊画面か？ -> 個別ヘッダー可。
- 個別ヘッダーを使う場合は、コードコメントか PR 説明に短く理由を残す。
