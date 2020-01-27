const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const optimization = {
  minimizer: [
    new TerserPlugin(),
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
    cacheGroups: {
      default: false,
      appAsync: {
        name: 'app_async',
        chunks: 'async',
        minChunks: 2,
        priority: 0,
        reuseExistingChunk: true,
        minSize: 50000,
      },
    },
  },
}

module.exports = optimization
