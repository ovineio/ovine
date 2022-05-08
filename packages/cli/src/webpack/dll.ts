/**
 * webpack dll config
 * do not use "publicPath".
 * TODO: add manifest.json to dll/dir/xx for dllPublic path.
 */

import AssetsPlugin from 'assets-webpack-plugin'
import CleanPlugin from 'clean-webpack-plugin'
import _ from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { DllPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import * as constants from '../constants'
import { DllCliOptions, Props } from '../types'
import { getModulePath, mergeWebpackConfig } from '../utils'
import * as amis from './amis'
import { getDllBabelConfig } from './babel'
import DllPostPlugin from './plugins/dll_post_plugin'
import LogPlugin from './plugins/log_plugin'
import MomentPlugin from './plugins/moment_plugin'
import MonacoWebpackPlugin from './plugins/monaco_editor_plugin'

// eslint-disable-next-line import/order
import chalk = require('chalk')

const {
  webpackDllConfFileName,
  dllDirPath,
  dllVendorFileName,
  dllManifestFile,
  dllAssetsFile,
  libName,
  dllChunkFilePrefix,
} = constants

const dllModules = [
  'react-router-dom',
  'whatwg-fetch',
  'qs',
  'immer',
  'lodash',
  'styled-components',
  'amis',
  'bootstrap/dist/js/bootstrap.bundle.js',

  'bootstrap/dist/css/bootstrap.css',
  'animate.css/animate.css',
  'font-awesome/css/font-awesome.css',
  // 'react-datetime/css/react-datetime.css',
  'video-react/dist/video-react.css',
  'cropperjs/dist/cropper.css',
  'tinymce/skins/ui/oxide/skin.css',
  'froala-editor/css/froala_style.min.css',
  'froala-editor/css/froala_editor.pkgd.min.css',
  'codemirror/lib/codemirror.css',
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
        '\nDll webpack config must set entry.dll_vendor must function or array of module name...'
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
        chalk.red(
          '\nDll webpack config entry.dll_vendor function must return array of module name...'
        )
      )
    }
  }
}

function addEditorFilesToDll(options: ConfigOptions) {
  const { siteDir } = options

  const getEditorFile = (filePath: string) =>
    getModulePath(siteDir, `lib/editor/lib/assets/${filePath}`) || ''

  // TODO: do not build dll with editor.view.js ----> use lazy load for it.
  const editorPath = getEditorFile('scripts/editor.view.js')
  if (editorPath) {
    dllModules.push(editorPath)
    dllModules.push(getEditorFile('styles/editor.view.css'))
  }
}

/**
 *  deprecated
 */
// export function monacoWorkerConfig(options: ConfigOptions): any {
//   const { siteDir } = options

//   const monacoVar = require('monaco-editor/package.json').version
//   const venderPath = `${siteDir}/${dllDirPath}`

//   const entries = {
//     'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
//     'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
//     'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
//     'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
//     'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
//   }

//   const entry = _.omitBy(entries, (__, key) => {
//     return fse.existsSync(`${venderPath}/${key}.${monacoVar}.js`)
//   })

//   // avoid same version repeat pack
//   if (_.isEmpty(entry)) {
//     return false
//   }

//   // monaco-editor doc: https://github.com/Microsoft/monaco-editor/blob/HEAD/docs/integrate-esm.md
//   const config = {
//     entry,
//     mode: 'production',
//     output: {
//       pathinfo: false,
//       path: venderPath,
//       filename: `[name].${monacoVar}.js`,
//       libraryTarget: 'window',
//       // publicPath: `${publicPath}${dllVendorDirPath}/`,
//     },
//     performance: {
//       hints: false, // not necessary
//     },
//     plugins: [
//       new CleanPlugin({
//         cleanOnceBeforeBuildPatterns: _.keys(entry).map((i) => `${i}.*`),
//       }),
//     ],
//   }

//   return config
// }

const { editorFileReg, factoryFileReg, froalaEditorReg, chartFileReg, apiUtilReg } = amis

type ConfigOptions = Props & Partial<DllCliOptions>
export function createDllConfig(options: ConfigOptions) {
  const { siteDir, siteConfig, withHash, bundleAnalyzer, embedAssets } = options

  const getHashStr = (hashTpl) => (!withHash ? '' : `_${hashTpl}`)
  const dllName = `[name]${getHashStr('[hash:6]')}`

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
          exclude: [editorFileReg, factoryFileReg, froalaEditorReg, chartFileReg, apiUtilReg],
          use: [babelLoader],
        },
        {
          test: editorFileReg,
          use: [babelLoader, amis.fixEditorLoader()],
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
          test: chartFileReg,
          use: [babelLoader, amis.fixChartLoader()],
        },
        {
          test: apiUtilReg,
          use: [babelLoader, amis.fixApiUtilLoader()],
        },
        {
          test: /\.css$/,
          exclude: !withHash ? [amis.bootStropCss, amis.fontAwesomeCss] : [amis.bootStropCss],
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: amis.bootStropCss,
          use: [MiniCssExtractPlugin.loader, 'css-loader', amis.fixBootStropCss()],
        },
        !withHash && {
          test: amis.fontAwesomeCss,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            amis.fixFontAwesomeCss({ siteDir, embedAssets }),
          ],
        },
        {
          test: new RegExp(
            `\\.${`(png,jpg,gif,ttf,woff,woff2,eot,svg${
              !siteConfig.staticFileExts ? '' : `,${siteConfig.staticFileExts}`
            }`.replace(/,/gi, '|')})$`
          ),
          exclude: [/[\\/]qs\//, /[\\/]icons[\\/]/, amis.fontAwesomeCss],
          use: [
            {
              loader: 'url-loader',
              options: {
                publicPath: './', // : `${publicPath}${dllVendorDirPath}/`,
                limit: embedAssets ? 500 * 1000 : 2000, // 低于2K 使用 base64
                name: `dll_[name]${getHashStr('[contenthash:6]')}.[ext]`,
              },
            },
          ],
        },
      ].filter(Boolean),
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
      chunkFilename: `${dllChunkFilePrefix}[name]${getHashStr('[chunkhash:6]')}.js`,
      library: dllName,
      libraryTarget: 'window',
      // publicPath: `${publicPath}${dllVendorDirPath}/`,
    },
    plugins: [
      new LogPlugin({
        name: `${libName}-Dll`,
      }),
      new CleanPlugin(),
      new MonacoWebpackPlugin({
        filename: `monaco_worker_[name]${getHashStr('[contenthash:6]')}.js`,
      }),
      new MomentPlugin({
        localesToKeep: ['zh-cn'],
      }),
      new MiniCssExtractPlugin({
        filename: `${dllName}.css`,
        chunkFilename: `${dllChunkFilePrefix}[name]${getHashStr('[chunkhash:6]')}.css`,
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
      new DllPostPlugin({
        siteDir,
        withHash,
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
            //  pick some core pkgs to be subcontracted
            test: /[\\/]node_modules[\\/](react|react-router-dom|whatwg-fetch|styled-components|lodash|moment|immer|qs|@hot-loader|mobx|mobx-react|mobx-state-tree|jquery)[\\/]/,
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

  addEditorFilesToDll(options)

  const config = mergeWebpackConfig(dllConfig, `${siteDir}/${webpackDllConfFileName}`)

  setDllVendorModules(config)

  return config
}
