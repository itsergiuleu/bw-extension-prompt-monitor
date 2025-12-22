const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    background: './src/backend/background.worker.ts',
    content: './src/frontend/content.tsx',
    'inject-fetch-interceptor': './src/backend/inject-fetch-interceptor.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@/frontend': path.resolve(__dirname, 'src/frontend'),
      '@/backend': path.resolve(__dirname, 'src/backend'),
      '@/shared': path.resolve(__dirname, 'src/shared')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};
