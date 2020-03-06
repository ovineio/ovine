import { version as cacheLoaderVersion } from 'cache-loader/package.json'
import CleanPlugin from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TsCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import fs from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import _ from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { Configuration, DllReferencePlugin, EnvironmentPlugin } from 'webpack'

import { loadContext } from '../config'
import * as constants from '../constants'
import { BuildCliOptions, DevCliOptions, Props } from '../types'
import { mergeWebpackConfig, globalStore } from '../utils'

import { getBabelConfig } from './babel'
import LogPlugin from './plugins/log_plugin'

const {
  libName,
  generatedDirName,
  staticDirName,
  tsConfFileName,
  tsLintConfFileName,
  webpackConfFileName,
  dllVendorDirPath,
  dllManifestFile,
  dllVendorFileName,
  dllAssetsFile,
  staticLibDirPath,
  esLintFileName,
} = constants

type BaseConfigOptions = Props & Partial<DevCliOptions> & Partial<BuildCliOptions>
export function createBaseConfig(options: BaseConfigOptions): Configuration {
  const { outDir, srcDir, siteDir, publicPath, env, bundleAnalyzer, mock, siteConfig } = options

  const isProd = globalStore('get', 'isProd') || false

  const cacheLoader = {
    loader: 'cache-loader',
    options: {
      cacheIdentifier: `cache-loader:${cacheLoaderVersion}`,
    },
  }

  const babelLoader = {
    loader: 'babel-loader',
    options: getBabelConfig(siteDir),
  }

  const useTs = fs.existsSync(`${siteDir}/${tsConfFileName}`)

  const baseConfig = {
    mode: process.env.NODE_ENV,
    entry: [
      // Instead of the default WebpackDevServer client, we use a custom one
      // like CRA to bring better experience.
      !isProd && require.resolve('react-dev-utils/webpackHotDevClient'),
      `${srcDir}/index`,
    ].filter(Boolean) as string[],
    output: {
      // Use future version of asset emitting logic, which allows freeing memory of assets after emitting.
      publicPath,
      futureEmitAssets: true,
      pathinfo: false,
      path: outDir,
      filename: isProd ? '[name].[contenthash:6].js' : '[name].js',
      chunkFilename: isProd ? '[name].[contenthash:6].js' : '[name].js',
    },
    // Don't throw warning when asset created is over 250kb
    performance: {
      maxEntrypointSize: 600 * 1000,
      maxAssetSize: 300 * 1000,
      assetFilter: (filePath) => {
        // Filter genDir or theme files
        const isLibFiles = filePath.indexOf(generatedDirName) > -1
        const isThemeStyles = /themes\/.*\.css/.test(filePath)
        return !isLibFiles && !isThemeStyles
      },
    },
    // Omit not necessary stats log
    stats: {
      chunkModules: false,
      assets: false,
    },
    // Source map help for trick bugs
    devtool: bundleAnalyzer
      ? false
      : isProd
      ? 'nosources-source-map'
      : 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      symlinks: true,
      alias: {
        '~': srcDir,
      },
      // This allows you to set a fallback for where Webpack should look for modules.
      modules: [
        path.resolve(__dirname, '..', '..', 'node_modules'),
        'node_modules',
        path.resolve(fs.realpathSync(process.cwd()), 'node_modules'),
      ],
    },
    optimization: {
      runtimeChunk: {
        // https://github.com/webpack/webpack/issues/7875
        name: ({ name }) => `runtime_${name}`,
      },
      removeAvailableModules: false,
      // Only minimize client bundle in production because server bundle is only used for static site generation
      minimize: isProd,
      splitChunks: {
        // Since the chunk name includes all origin chunk names it’s recommended for production builds with long term caching to NOT include [name] in the filenames
        name: false,
        automaticNameDelimiter: '_',
        cacheGroups: {
          default: false, // disabled default configuration
          vendors: false, // disabled splitChunks vendors configuration
          appVendor: {
            chunks: 'all',
            name: 'app_vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 8,
            minChunks: 1,
            reuseExistingChunk: false,
          },
          appCommon: {
            chunks: 'all',
            name: 'app_common',
            priority: 7,
            minChunks: 2,
          },
        },
      },
    },
    module: {
      rules: [
        !mock && {
          test: /[\\/]mock\.[t|j]sx?$/,
          use: 'null-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          exclude: excludeJS,
          use: [cacheLoader, babelLoader],
        },
        useTs && {
          test: /\.tsx?$/,
          exclude: excludeJS,
          use: [
            cacheLoader,
            { loader: 'thread-loader' },
            babelLoader,
            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: (isProd ? [MiniCssExtractPlugin.loader] : [cacheLoader, 'style-loader']).concat([
            'css-loader',
          ]),
        },
        {
          test: new RegExp(
            `\\.${(`png,jpg,gif,ttf,woff,woff2,eot,svg${!siteConfig.staticFileExt ?
                '' : `,${siteConfig.staticFileExt}`}`).replace(',', '|')}$`
          ),
          use: [
            {
              loader: 'url-loader',
              options: {
                publicPath,
                limit: 2000, // less than 2kb files use base64 url
                name: !isProd
                  ? '[path][name].[ext]'
                  : (modulePath) => {
                      const filePath = modulePath.replace(srcDir, '').replace('/assets', '')
                      return `assets/${path.dirname(filePath)}/[name]_[contenthash:6].[ext]`
                    },
              },
            },
          ],
        },
      ].filter(Boolean) as any[],
    },
    plugins: [
      new LogPlugin({
        name: `${libName}-${isProd ? 'build' : 'dev'}`,
      }),
      new CleanPlugin(),
      getCopyPlugin(siteDir),
      new EnvironmentPlugin({
        MOCK: mock,
        ENV: env,
      }),
      useTs &&
        new TsCheckerPlugin({
          tsconfig: `${siteDir}/${tsConfFileName}`,
          eslint: fs.existsSync(`${siteDir}/${esLintFileName}`),
          eslintOptions: fs.existsSync(`${siteDir}/${esLintFileName}`) && require(`${siteDir}/${esLintFileName}`),
          tslint: !fs.existsSync(`${siteDir}/${tsLintConfFileName}`) ? undefined : `${siteDir}/${tsLintConfFileName}`,
          reportFiles: [`${srcDir}/src/**/*.{ts,tsx}`, `${siteDir}/typings/**/*.{ts,tsx}`],
          silent: true,
        }),
      new DllReferencePlugin({
        manifest: `${siteDir}/${dllManifestFile}`,
      } as any),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash:6].css' : '[name].css',
        chunkFilename: isProd ? '[name].[contenthash:6].css' : '[name].css',
        // remove css order warnings if css imports are not sorted alphabetically
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422 for more reasoning
        ignoreOrder: true,
      }),
      new HtmlWebpackPlugin({
        ..._.pick(siteConfig.template, ['head', 'postBody', 'preBody']),
        title: siteConfig.title,
        favIcon: siteConfig.favicon,
        staticLibPath: `${publicPath}${staticLibDirPath}/`,
        template: path.resolve(__dirname, './template.ejs'),
        filename: `${outDir}/index.html`,
        dllVendorCss: getDllDistFile(siteDir, 'css'),
        dllVendorJs: getDllDistFile(siteDir, 'js'),
      }),
    ].filter(Boolean) as any[],
  }

  const config = mergeWebpackConfig(baseConfig, `${siteDir}/${webpackConfFileName}`)

  return config
}

function excludeJS(modulePath: string) {
  // Don't transpile node_modules except any @rtadmin npm package
  const isNodeModules = /node_modules/.test(modulePath)
  const notLibModules = /(@rtadmin)((?!node_modules).)*\.[j|t]sx?$/.test(modulePath)
  const isLibModules = isNodeModules && !notLibModules

  return isLibModules
}

function getDllDistFile(siteDir: string, type: string) {
  const { publicPath } = loadContext(siteDir)
  const dllBasePath = `${publicPath}${dllVendorDirPath}/`
  const assetJson = require(`${siteDir}/${dllAssetsFile}`)

  return `${dllBasePath}/${_.get(assetJson, `${dllVendorFileName}.${type}`)}`
}

function getCopyPlugin(siteDir: string) {
  const { outDir } = loadContext(siteDir)

  const generatedStaticDir = `${siteDir}/${generatedDirName}/${staticDirName}`
  const siteStaticDir = `${siteDir}/${staticDirName}`
  const outStaticDir = `${outDir}/${staticDirName}`
  const outLibDir = `${outDir}/${staticLibDirPath}`

  const amisPkg = 'node_modules/amis/sdk/pkg'
  const amisPkgPaths = [
    `${siteDir}/${amisPkg}`,
    path.resolve(siteDir, `../../${amisPkg}`),
  ].filter((pkgPath) => fs.pathExistsSync(pkgPath))

  const rtCoreStatic = 'node_modules/@rtadmin/core/static'
  const rtCorePaths = [
    `${siteDir}/${rtCoreStatic}`,
    path.resolve(siteDir, '../rt_core/static'),
    path.resolve(siteDir, `../../${rtCoreStatic}`),
  ].filter((corePath) => fs.pathExistsSync(corePath))

  const copyFiles: any = [
    {
      from: generatedStaticDir,
      to: outLibDir,
    },
  ]

  if (fs.pathExistsSync(siteStaticDir)) {
    copyFiles.unshift({
      from: siteStaticDir,
      to: outStaticDir,
    })
  }

  if (amisPkgPaths.length) {
    copyFiles.unshift({
      from: amisPkgPaths[0],
      to: `${outLibDir}/pkg/[name].[ext]`,
      toType: 'template',
    })
  }

  if (rtCorePaths.length) {
    copyFiles.unshift({
      from: rtCorePaths[0],
      to: `${outLibDir}/core`,
    })
  }

  return new CopyPlugin(copyFiles)
}
