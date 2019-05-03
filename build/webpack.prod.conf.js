const webpack = require('webpack')
const merge = require('webpack-merge')
const analyzer = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpackConfig = require('./webpack.conf')
const utils = require('./utils')

const { DllReferencePlugin } = webpack
const { BundleAnalyzerPlugin } = analyzer
const { isProd, enableAnalyzer, manifestPath, ANALYZER_PORT } = utils

const prodWebpackConfig = merge(webpackConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
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
  },
  performance: {
    maxEntrypointSize: 600 * 1000, // 入口包大小超过600k报警
    maxAssetSize: 400 * 1000, // 单个包大小超过400k报警
  },
})

prodWebpackConfig.plugins.push(
  new DllReferencePlugin({
    manifest: manifestPath,
  }),
  new MiniCssExtractPlugin({
    filename: '[name]_[hash:6].css',
    chunkFilename: 'chunk/[id]_[hash:6].css',
  })
)

if (enableAnalyzer && isProd) {
  const port = parseInt(ANALYZER_PORT)
  prodWebpackConfig.plugins.push(
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      analyzerPort: port,
    })
  )
}

module.exports = prodWebpackConfig
