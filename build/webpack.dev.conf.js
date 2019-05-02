const merge = require('webpack-merge')
const webpackConfig = require('./webpack.conf')
const utils = require('./utils')

const { PORT } = utils

const devWebpackConfig = merge(webpackConfig, {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
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
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      // our additional options
      moduleTrace: true,
      errorDetails: true,
    },
  },
})

module.exports = devWebpackConfig
