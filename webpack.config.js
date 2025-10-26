const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const { fileURLToPath } = require('url');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Tailwind CSSの設定を追加
  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader'
    ]
  });

  // PostCSS設定ファイルのパスを指定
  config.resolve.alias = {
    ...config.resolve.alias,
    'postcss.config.js': path.resolve(__dirname, 'postcss.config.js')
  };

  return config;
};
