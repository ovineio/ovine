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
import { getDllBabelConfig } from './babel'

const {
  webpackDllConfFileName,
  dllDirName,
  dllVendorFileName,
  dllManifestName,
  dllAssetsName,
  libName,
} = constants

const dllName = '[name]_[hash:6]'

const dllModules = [
  'react',
  'react-dom',
  'react-router-dom',
  'immer',
  'styled-components',
  'whatwg-fetch',
  // amis 更新频率较高（大概半个月左右），因此需要如果更新版本时要考虑升级对项目影响
  'amis',
  'bootstrap/dist/css/bootstrap.css',
  'animate.css/animate.css',
  'highlight.js/styles/shades-of-purple.css',
  'font-awesome/css/font-awesome.css',
  'react-datetime/css/react-datetime.css',
  'video-react/dist/video-react.css',
  'cropperjs/dist/cropper.css',
  'froala-editor/css/froala_style.min.css',
  'froala-editor/css/froala_editor.pkgd.min.css',
]

function setDllVendorModules(config) {
  const venderConfKey = `entry.${dllVendorFileName}`
  let vendorModules = _.get(config, venderConfKey)

  if (typeof vendorModules === 'undefined') {
    _.set(config, venderConfKey, dllModules)
    return
  }

  if (_.isArray(vendorModules)) {
    _.set(config, venderConfKey, _.uniq(dllModules.concat(vendorModules)))
  } else {
    console.error(
      chalk.red(
        '\nDll webpack config must set entry.vendor must function or array of module name...'
      )
    )
    return
  }

  if (_.isFunction(vendorModules)) {
    const vendorDllModules = vendorModules(dllModules)
    if (_.isArray(vendorDllModules)) {
      _.set(config, venderConfKey, vendorDllModules)
    } else {
      console.error(
        chalk.red('\nDll webpack config entry.vendor function must return array of module name...')
      )
      return
    }
  }
}

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
              options: getDllBabelConfig(siteDir),
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

  const config = mergeWebpackConfig(dllConfig, `${siteDir}/${webpackDllConfFileName}`)

  setDllVendorModules(config)

  return config
}
