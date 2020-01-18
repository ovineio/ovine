const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')

const utils = require('./utils')

const { rootDir, dllPaths } = utils
const { DllPlugin } = webpack

const dllName = '[name]_[hash:6]'

const dellWebpackConfig = {
  mode: 'production',
  entry: {
    dll_vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'immer',
      'hash.js',
      'styled-components',
      'whatwg-fetch',
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  output: {
    pathinfo: false,
    path: rootDir(dllPaths.dllVendorJsPath),
    filename: `${dllName}.js`,
    library: dllName,
  },
  plugins: [
    new CleanPlugin({
      cleanOnceBeforeBuildPatterns: ['dll_vendor_*'],
    }),
    new DllPlugin({
      path: dllPaths.manifestPath,
      name: dllName,
    }),
    // 把带hash的dll插入到html中 https://github.com/ztoben/assets-webpack-plugin
    new AssetsPlugin({
      filename: dllPaths.manifestAssetsName,
      fullPath: false,
      path: './',
    }),
  ],
  performance: {
    maxEntrypointSize: 1000000,
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
}

module.exports = dellWebpackConfig
