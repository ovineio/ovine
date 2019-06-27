const merge = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackConfig = require('./webpack.conf')
const utils = require('./utils')

const { PORT, srcDir, rootDir, distDir } = utils

const devWebpackConfig = merge(webpackConfig, {
  mode: 'development',
  entry: srcDir('index.tsx'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js|jsx$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: rootDir('.cache'),
            },
          },
          'babel-loader',
        ],
        exclude: /node_modules|packages/,
      },
      {
        test: /\.ts|tsx$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: rootDir('.cache'),
            },
          },
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: srcDir(),
        exclude: /node_modules|packages/,
      },
    ],
  },
  resolve: {
    alias: {
      // 本地开发使用 本地包
      'json-form': rootDir('../rt-admin-lib/source/react-jsonschema-form/lib'),
    },
  },
  devServer: {
    port: PORT,
    host: '0.0.0.0',
    inline: true,
    watchContentBase: true,
    overlay: true,
    hot: true,
    historyApiFallback: true,
    open: true,
    useLocalIp: true,
    // 不同 域名下 触发浏览器自动更新 https://github.com/webpack/webpack-dev-server/issues/533
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    stats: {
      all: false,
      timings: true,
      errors: true,
      colors: true,
      warnings: true,
      // our additional options
      moduleTrace: true,
      errorDetails: true,
    },
  },
})

devWebpackConfig.plugins.push(
  new CopyPlugin([
    { from: rootDir('static'), to: distDir('static'), ignore: ['.*'] },
    // 本地开发使用 本地包
    { from: rootDir('../rt-admin-lib/source/layui/src'), to: distDir('static/layui') },
  ]),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  })
)

module.exports = devWebpackConfig
