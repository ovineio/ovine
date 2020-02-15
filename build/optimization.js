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
    // maxInitialRequests: Infinity,
    automaticNameDelimiter: '_',
    cacheGroups: {
      default: false, // 取消 splitChunks 默认配置
      vendors: false, // 取消 splitChunks vendors 配置
      appTheme: {
        chunks: 'all',
        name: 'theme',
        test: /theme/,
        priority: 10,
        minChunks: 1,
        reuseExistingChunk: false,
      },
      appVendor: {
        chunks: 'all',
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        priority: 8,
        minChunks: 1,
        reuseExistingChunk: false,
      },
      appAsync: {
        chunks: 'async',
        name: 'async',
        priority: 7,
        minChunks: 3,
        reuseExistingChunk: true,
      },
    },
  },
}

module.exports = optimization
