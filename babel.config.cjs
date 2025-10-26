// babel.config.cjs
module.exports = function (api) {
  api.cache(true);
  return {
    // 依存パッケージ内の .babelrc を拾わない（今回の再発防止）
    babelrc: false,
    babelrcRoots: ['.'],
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',                  // ← 公式どおり preset で
    ],
    plugins: [
      'expo-router/babel',                 // Router 使う場合は推奨（未使用なら省略可）
      'react-native-reanimated/plugin',    // Reanimated は最後
    ],
  };
};
