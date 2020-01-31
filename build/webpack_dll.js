const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const utils = require('./utils')

const { rootDir, dllPaths } = utils
const { DllPlugin } = webpack

const dllName = '[name]_[hash:6]'

// 是否启用分析工具
const enableAnalyzer = true

// 需要打包到 dll 的模块
// 1. 项目必须依赖的基础模块
// 2. 长期不更新的第三方模块
// 3. 可以异步按需加载的模块，尽量不要添加进来
// 4. 每次修改本文件, 或者对应npm包升级。都要执行 yarn build:dll 才能生效
const dllModules = [
  'react',
  '@hot-loader/react-dom',
  'react-router-dom',
  'immer',
  'styled-components',
  'amis',
  'whatwg-fetch',
]

const dellWebpackConfig = {
  mode: 'production',
  entry: {
    dll_vendor: dllModules,
  },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              compact: true,
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  output: {
    pathinfo: false,
    path: rootDir(dllPaths.dllVendorJsPath),
    filename: `${dllName}.js`,
    chunkFilename: 'chunk_[name]_[chunkhash:6].js',
    library: dllName,
  },
  plugins: [
    new CleanPlugin(),
    new MiniCssExtractPlugin({
      filename: `${dllName}.css`,
      chunkFilename: 'chunk_[name]_[chunkhash:6].css',
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
  // 关闭文件大小报警，具体情况，可查看分析工具
  performance: {
    hints: false,
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      maxInitialRequests: Infinity,
      automaticNameDelimiter: '_',
      cacheGroups: {
        default: false,
        vendors: false,
        monacoLanguages: {
          chunks: 'async',
          name: 'monaco_languages',
          test: /monaco-editor[\\/].*language/,
          priority: 10,
          minChunks: 1,
        },
      },
    },
  },
}

if (enableAnalyzer) {
  dellWebpackConfig.plugins.push(
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    new BundleAnalyzerPlugin({
      analyzerPort: 7052,
    })
  )
}

module.exports = dellWebpackConfig
