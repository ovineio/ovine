const webpack = require('webpack')
const merge = require('webpack-merge')
const analyzer = require('webpack-bundle-analyzer')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const threadLoader = require('thread-loader')
const webpackConfig = require('./webpack.conf')
const utils = require('./utils')

const { DllReferencePlugin } = webpack
const { BundleAnalyzerPlugin } = analyzer
const { ANALYZER_PORT, isProd, enableAnalyzer, manifestPath, srcDir, distDir } = utils

threadLoader.warmup({}, ['babel-loader', 'ts-loader'])

const prodWebpackConfig = merge(webpackConfig, {
  mode: 'production',
  devtool: false,
  entry: srcDir('index.tsx'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js|jsx$/,
        use: ['babel-loader'],
        exclude: /node_modules|packages/,
      },
      {
        test: /\.ts|tsx$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 2,
            },
          },
          {
            loader: 'thread-loader',
            options: {
              workers: 2,
            },
          },
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules|packages/,
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
  stats: {
    chunkModules: false,
    assets: false,
  },
})

prodWebpackConfig.plugins.push(
  new CopyPlugin([
    { from: rootDir('static'), to: distDir('static'), ignore: ['.*'] },
    { from: rootDir('node_modules/rt-admin-lib/layui'), to: distDir('static/layui') },
  ]),
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
