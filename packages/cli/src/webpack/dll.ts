import AssetsPlugin from 'assets-webpack-plugin'
import CleanPlugin from 'clean-webpack-plugin'
import fse from 'fs-extra'
import _ from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { DllPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import * as constants from '../constants'
import { DllCliOptions, Props } from '../types'
import { mergeWebpackConfig } from '../utils'
import * as amis from './amis'
import { getDllBabelConfig } from './babel'
import DllManifestPlugin from './plugins/dll_manifest_plugin'
import LogPlugin from './plugins/log_plugin'
import MomentPlugin from './plugins/moment_plugin'

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
  'whatwg-fetch',
  'copy-to-clipboard',
  'qs',
  'immer',
  'lodash',
  'styled-components',
  'amis',
  'bootstrap/dist/js/bootstrap.bundle.js',

  'bootstrap/dist/css/bootstrap.css',
  'animate.css/animate.css',
  'font-awesome/css/font-awesome.css',
  'react-datetime/css/react-datetime.css',
  'video-react/dist/video-react.css',
  'cropperjs/dist/cropper.css',
  'tinymce/skins/ui/oxide/skin.css',
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

export function monacoWorkerConfig(options: ConfigOptions): any {
  const { publicPath, siteDir } = options

  const monacoVar = require('monaco-editor/package.json').version
  const venderPath = `${siteDir}/${dllDirPath}`

  const entries = {
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
  }

  const entry = _.omitBy(entries, (__, key) => {
    return fse.existsSync(`${venderPath}/${key}.${monacoVar}.js`)
  })

  // avoid same version repeat pack
  if (_.isEmpty(entry)) {
    return false
  }

  // monaco-editor doc: https://github.com/Microsoft/monaco-editor/blob/HEAD/docs/integrate-esm.md
  const config = {
    entry,
    mode: 'production',
    output: {
      pathinfo: false,
      path: venderPath,
      filename: `[name].${monacoVar}.js`,
      publicPath: `${publicPath}${dllVendorDirPath}/`,
    },
    performance: {
      hints: false, // not necessary
    },
    plugins: [
      new CleanPlugin({
        cleanOnceBeforeBuildPatterns: _.keys(entry).map((i) => `${i}.*`),
      }),
    ],
  }

  return config
}

const { editorFileReg, factoryFileReg, froalaEditorReg, videoFileReg, apiUtilReg } = amis

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
          exclude: [editorFileReg, factoryFileReg, froalaEditorReg, videoFileReg, apiUtilReg],
          use: [babelLoader],
        },
        {
          test: editorFileReg,
          use: [babelLoader, amis.fixEditorLoader({ publicPath })],
        },
        {
          test: factoryFileReg,
          use: [babelLoader, amis.fixFactoryLoader()],
        },
        {
          test: froalaEditorReg,
          use: [babelLoader, amis.fixFroalaLoader()],
        },
        {
          test: videoFileReg,
          use: [babelLoader, amis.fixVideoLoader()],
        },
        {
          test: apiUtilReg,
          use: [babelLoader, amis.fixApiUtilLoader()],
        },
        {
          test: /\.css$/,
          exclude: [amis.bootStropCss],
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: amis.bootStropCss,
          use: [MiniCssExtractPlugin.loader, 'css-loader', amis.fixBootStropCss()],
        },
        {
          test: new RegExp(
            `\\.${`(png,jpg,gif,ttf,woff,woff2,eot,svg${
              !siteConfig.staticFileExts ? '' : `,${siteConfig.staticFileExts}`
            }`.replace(/,/gi, '|')})$`
          ),
          exclude: [/[\\/]qs\//, /[\\/]icons[\\/]/],
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
      new CleanPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!*.worker.*'],
      }),
      new MomentPlugin({
        localesToKeep: ['zh-cn'],
      }),
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
      new DllManifestPlugin({
        siteDir,
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
          /**
           * split one big dll bundle file into some small file.
           */
          boot: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/](react|react-router-dom|whatwg-fetch|styled-components|lodash|moment|immer|qs|@hot-loader)[\\/]/,
            name: 'boot',
            priority: 30,
          },
          amis: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]amis[\\/]/,
            name: 'amis',
            priority: 20,
          },
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
