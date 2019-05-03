const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const package = require('../package.json')
const utils = require('./utils')

const { EnvironmentPlugin } = webpack
const { ENV, API_ENV, srcDir, distDir, rootDir, isProd, dllVendorJs } = utils

const webpackConfig = {
  mode: ENV,
  bail: true,
  entry: srcDir('index.tsx'),
  output: {
    path: distDir(),
    filename: 'index_[hash:6].js',
    publicPath: '/',
    chunkFilename: 'chunk/[id]_[hash:6].js',
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: ['babel-loader'],
        exclude: /node_modules|packages/,
      },
      {
        test: /\.ts|tsx$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules|packages/,
      },
      {
        test: /\.(png|jpg|gif|ttf|woff|woff2|eot|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000, // 低于2K 使用 base64
              publicPath: '/',
              name: (resourcePath) => {
                // 去除无用文件夹
                const path = resourcePath
                  .replace(`${__dirname}/src/assets`, '')
                  .replace(`${__dirname}/src`, '')
                  .replace('/images', '')
                return `assets${path}`
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@assets': srcDir('assets'),
      '@config': srcDir('config'),
      '@components': srcDir('components'),
      '@widgets': srcDir('widgets'),
      '@hooks': srcDir('hooks'),
      '@routes': srcDir('routes'),
      '@pages': srcDir('pages'),
      '@constants': srcDir('constants'),
      '@core': srcDir('core'),
      '@utils': srcDir('utils'),
    },
  },
  optimization: {
    occurrenceOrder: true,
    // https://webpack.js.org/plugins/split-chunks-plugin/
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        default: false,
        commonsAsync: {
          name: 'commons.async',
          minChunks: 2,
          chunks: 'async',
          priority: 0,
          reuseExistingChunk: true,
          minSize: 50000,
        },
      },
    },
  },
  plugins: [
    new CleanPlugin(),
    new CopyPlugin([
      { from: rootDir('static'), to: distDir('static'), ignore: ['.*'] },
      { from: rootDir('node_modules/rt-admin-lib/layui'), to: distDir('static/layui') },
    ]),
    new EnvironmentPlugin({
      API_ENV,
      ENV,
    }),
    new HtmlWebpackPlugin({
      title: 'RT-Admin',
      template: srcDir('index.html'),
      faviconIco: '/static/favicon.ico',
      faviconPng: '/static/logo.png',
      filename: distDir('index.html'),
      version: package.version,
      dllVendorJs: isProd ? dllVendorJs() : '',
      layuiCss: '/static/layui/css/layui.css',
      layuiJs: '/static/layui/layui.js',
    }),
  ],
}

module.exports = webpackConfig
