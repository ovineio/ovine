const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const utils = require('./utils')

const { rootDir, manifestPath, dllVendorJsPath, manifestAssetsName } = utils
const { DllPlugin } = webpack

const dellWebpackConfig = {
  entry: {
    dll_vendor: [
      'react',
      'immer',
      'hash.js',
      'react-router-config',
      'react-router-dom',
      'styled-components',
      'whatwg-fetch',
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  output: {
    path: rootDir(dllVendorJsPath),
    filename: '[name]_[hash:6].js',
    library: '[name]_[hash:6]',
  },
  plugins: [
    new CleanPlugin({
      cleanOnceBeforeBuildPatterns: ['dll_vendor_*'],
    }),
    new DllPlugin({
      path: manifestPath,
      name: '[name]_[hash:6]',
    }),
    // 把带hash的dll插入到html中 https://github.com/ztoben/assets-webpack-plugin
    new AssetsPlugin({
      filename: manifestAssetsName,
      fullPath: false,
      path: './',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
}

module.exports = dellWebpackConfig
