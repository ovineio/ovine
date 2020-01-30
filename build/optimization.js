const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const utils = require('./utils')

const { enableAnalyzer } = utils

const optimization = {
  minimizer: [
    new TerserPlugin({
      sourceMap: enableAnalyzer ? false : true,
    }),
    // https://www.npmjs.com/package/optimize-css-assets-webpack-plugin
    new OptimizeCSSAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: false,
    }),
  ],
  occurrenceOrder: true,
  // https://webpack.js.org/plugins/split-chunks-plugin/
  splitChunks: {
    // minSize: 30000,
    maxInitialRequests: Infinity,
    automaticNameDelimiter: '_',
    cacheGroups: {
      default: false, // 取消 splitChunks 默认配置
      vendors: false, // 取消 splitChunks vendors 配置
      // 缓存文件 每一个Key,对应的配置就是一种打包规则
      appAsync: {
        // 异步加载模块 被应用3次以上的模块
        chunks: 'async',
        name: 'app_async',
        priority: 10,
        minChunks: 3, // 当异步模块只被应用2次时，会分别打包到引用两个入口中。
        reuseExistingChunk: true,
      },
      appCore: {
        // 项目内核心文件 => 全部打包为一个
        chunks: 'all',
        name: 'app_core',
        test: /src[\\/]assets|config|constants|core|utils|routes|widgets[\\/]/,
        priority: 9,
        minChunks: 2,
        reuseExistingChunk: true,
      },
    },
  },
}

module.exports = optimization
