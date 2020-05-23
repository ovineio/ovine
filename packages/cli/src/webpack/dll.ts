import AssetsPlugin from 'assets-webpack-plugin'
import CleanPlugin from 'clean-webpack-plugin'
import _ from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { DllPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import * as constants from '../constants'
import { DllCliOptions, Props } from '../types'
import { mergeWebpackConfig } from '../utils'
import { editorFileReg, factoryFileReg, fixEditorLoader, fixFactoryLoader } from './amis'
import { getDllBabelConfig } from './babel'
import LogPlugin from './plugins/log_plugin'

import chalk = require('chalk')

const {
  webpackDllConfFileName,
  dllDirPath,
  dllVendorFileName,
  dllManifestFile,
  dllAssetsFile,
  libName,
  dllVendorDirPath,
} = constants

const dllName = '[name]_[hash:6]'

const dllModules = [
  'react-router-dom',
  'immer',
  'styled-components',
  'whatwg-fetch',
  'qs',
  'amis',
  'bootstrap/dist/js/bootstrap.bundle.js',
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
  const vendorModules = _.get(config, venderConfKey)

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
    }
  }
}

type ConfigOptions = Props & Partial<DllCliOptions>
export function createDllConfig(options: ConfigOptions) {
  const { publicPath, siteDir, siteConfig, bundleAnalyzer } = options

  const babelLoader = {
    loader: 'babel-loader',
    options: getDllBabelConfig(siteDir),
  }

  const dllConfig = {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.[t|j]sx?$/,
          exclude: [editorFileReg, factoryFileReg],
          use: [babelLoader],
        },
        {
          test: editorFileReg,
          use: [babelLoader, fixEditorLoader({ publicPath })],
        },
        {
          test: factoryFileReg,
          use: [babelLoader, fixFactoryLoader()],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: new RegExp(
            `\\.${`png,jpg,gif,ttf,woff,woff2,eot,svg${
              !siteConfig.staticFileExts ? '' : `,${siteConfig.staticFileExts}`
            }`.replace(/,/gi, '|')}$`
          ),
          exclude: [/\/qs\//, /\/icons\//],
          use: [
            {
              loader: 'url-loader',
              options: {
                publicPath: `${publicPath}${dllVendorDirPath}/`,
                limit: 2000, // 低于2K 使用 base64
                name: '[name]_[contenthash:6].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    output: {
      pathinfo: false,
      path: `${siteDir}/${dllDirPath}`,
      filename: `${dllName}.js`,
      chunkFilename: 'chunk_[name]_[chunkhash:6].js',
      library: dllName,
      publicPath: `${publicPath}${dllVendorDirPath}/`,
    },
    plugins: [
      new LogPlugin({
        name: `${libName}-VendorDll`,
      }),
      new CleanPlugin(),
      new MiniCssExtractPlugin({
        filename: `${dllName}.css`,
        chunkFilename: 'chunk_[name]_[chunkhash:6].css',
      }),
      new DllPlugin({
        path: `${siteDir}/${dllManifestFile}`,
        name: dllName,
      }),
      new AssetsPlugin({
        filename: dllAssetsFile.replace('[name]', dllVendorFileName),
        fullPath: false,
        path: siteDir,
      }),
    ],
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
