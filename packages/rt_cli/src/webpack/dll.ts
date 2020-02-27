import AssetsPlugin from 'assets-webpack-plugin'
import chalk = require('chalk')
import CleanPlugin from 'clean-webpack-plugin'
import _ from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { DllPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import LogPlugin from './plugins/log_plugin'

import * as constants from '../constants'
import { DllCliOptions, Props } from '../types'
import { mergeWebpackConfig } from '../utils'

const {
  webpackDllConfFileName,
  dllDirName,
  dllVendorFileName,
  dllManifestName,
  dllAssetsName,
  libName,
} = constants

const dllName = '[name]_[hash:6]'

// 需要打包到 dll 的模块
// 1. 项目必须依赖的基础模块
// 2. 长期不更新的第三方模块
// 3. 可以异步按需加载的模块，尽量不要添加进来
// 4. 每次修改本文件, 或者对应npm包升级。都要执行 yarn build:dll 才能生效
const dllModules = [
  'react',
  'react-dom',
  'react-router-dom',
  'immer',
  'styled-components',
  'whatwg-fetch',
  // amis 更新频率较高（大概半个月左右），因此需要如果更新版本时要考虑升级对项目影响
  'amis',
  'font-awesome/css/font-awesome.css',
  'react-datetime/css/react-datetime.css',
  'video-react/dist/video-react.css',
  'cropperjs/dist/cropper.css',
  'froala-editor/css/froala_style.min.css',
  'froala-editor/css/froala_editor.pkgd.min.css',
]

type ConfigOptions = Props & Partial<DllCliOptions>
export function createDllConfig(options: ConfigOptions) {
  const { publicPath, siteDir, bundleAnalyzer } = options

  const dllConfig = {
    mode: 'production',
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
        {
          test: /\.png|jpg|gif|ttf|woff|woff2|eot|svg$/,
          exclude: /qs\//,
          use: [
            {
              loader: 'url-loader',
              options: {
                publicPath: `${publicPath}${dllDirName}/`,
                limit: 2000, // 低于2K 使用 base64
                name: '[name]_[contenthash:6].[ext]',
              },
            },
          ],
        },
      ],
    },
    output: {
      pathinfo: false,
      path: `${siteDir}/${dllDirName}`,
      filename: `${dllName}.js`,
      chunkFilename: 'chunk_[name]_[chunkhash:6].js',
      library: dllName,
      publicPath: `${publicPath}${dllDirName}/`,
    },
    plugins: [
      new LogPlugin({
        name: `${libName}-dll`,
      }),
      new CleanPlugin(),
      new MiniCssExtractPlugin({
        filename: `${dllName}.css`,
        chunkFilename: 'chunk_[name]_[chunkhash:6].css',
      }),
      new DllPlugin({
        path: `${siteDir}/${dllManifestName}`,
        name: dllName,
      }),
      // 把带hash的dll插入到html中 https://github.com/ztoben/assets-webpack-plugin
      new AssetsPlugin({
        filename: dllAssetsName,
        fullPath: false,
        path: siteDir,
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

  if (bundleAnalyzer) {
    dllConfig.plugins.push(
      // https://github.com/webpack-contrib/webpack-bundle-analyzer
      new BundleAnalyzerPlugin()
    )
  }

  const realConfig = mergeWebpackConfig(dllConfig, `${siteDir}/${webpackDllConfFileName}`)
  const venderConfKey = `entry.${dllVendorFileName}`
  const vendorModules = _.get(realConfig, venderConfKey) || []

  if (!_.isArray(vendorModules)) {
    console.error(chalk.red('\n   Dll webpack config must set entry.vendor modules name array...'))
    return
  }

  _.set(realConfig, venderConfKey, _.uniq(dllModules.concat(vendorModules)))

  return realConfig
}
