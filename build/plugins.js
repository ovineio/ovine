const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const analyzer = require('webpack-bundle-analyzer')

const package = require('../package.json')

const utils = require('./utils')

const { EnvironmentPlugin, DllReferencePlugin } = webpack
const { BundleAnalyzerPlugin } = analyzer
const {
  API_ENV,
  ENV,
  ANALYZER_PORT,
  dllPaths,
  isProd,
  rootDir,
  srcDir,
  distDir,
  enableAnalyzer,
} = utils

const plugins = [
  new CleanPlugin(),
  new EnvironmentPlugin({
    API_ENV: API_ENV,
    ENV: ENV,
  }),
  // https://github.com/Realytics/fork-ts-checker-webpack-plugin
  new TsCheckerPlugin({
    tsconfig: rootDir('tsconfig.json'),
    tslint: rootDir('tslint.json'),
    silent: true,
  }),
  new DllReferencePlugin({
    manifest: dllPaths.manifestPath,
  }),
  new MiniCssExtractPlugin({
    filename: '[name]_[contenthash:6].css',
    chunkFilename: 'chunk/[name]_[contenthash:6].css',
  }),
  new CopyPlugin([
    {
      // https://github.com/webpack-contrib/copy-webpack-plugin#totype
      from: rootDir('node_modules/amis/lib/themes/*.css'),
      to: rootDir('static/css/themes/[name].[ext]'),
      toType: 'template',
    },
    { from: rootDir('static'), to: distDir('static') },
  ]),
  new HtmlWebpackPlugin({
    title: 'RT-ADMIN',
    faviconIco: '/static/images/favicon.ico',
    faviconPng: '/static/images/logo.png',
    template: srcDir('index.html'),
    filename: distDir('index.html'),
    version: package.version,
    dllVendorJs: dllPaths.dllVendorJs,
  }),
]

plugins.push(
  new DllReferencePlugin({
    manifest: require(dllPaths.manifestPath),
  })
)

if (enableAnalyzer && isProd) {
  const port = parseInt(ANALYZER_PORT)
  plugins.push(
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      analyzerPort: port,
    })
  )
}

module.exports = plugins
