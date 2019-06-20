'use strict';

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const src = './src/js';
const filename = 'app';
const vueImageDir = '/images/vue/';

module.exports = {
  mode: 'production',
  entry: `${src}/${filename}.js`,
  output: {
    path: path.resolve(__dirname, 'dest'),
    filename: `${filename}.js`,
  },
  devServer: {
    contentBase: path.join(__dirname, 'dest'),
  },
  cache: true,
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      src,
      'node_modules',
    ],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      'npm': path.resolve('node_modules'),
      '@': path.resolve(src),
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.(gif|png|jpg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: vueImageDir,
              publicPath: (path) => vueImageDir + path,
            },
          },
        ],
      },
      {
        test: /\.(sc|c|sa)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        enforce: 'pre', // babel前に実行
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};
