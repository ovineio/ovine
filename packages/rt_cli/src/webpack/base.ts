import { version as cacheLoaderVersion } from 'cache-loader/package.json'
import CleanPlugin from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TsCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import fs from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import _ from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { Configuration, DllReferencePlugin, EnvironmentPlugin } from 'webpack'

import * as constants from '../constants'
import { BuildCliOptions, DevCliOptions, Props } from '../types'
import { mergeWebpackConfig } from '../utils'

import babelConfig from './babel'
import LogPlugin from './plugins/log_plugin'

const cacheLoader = {
  loader: 'cache-loader',
  options: {
    cacheIdentifier: `cache-loader:${cacheLoaderVersion}`,
  },
}

const babelLoader = {
  loader: 'babel-loader',
  options: babelConfig,
}

const {
  libName,
  generatedDirName,
  staticDirName,
  tsConfFileName,
  tsLintConfFileName,
  dllVendorPath,
  dllManifestName,
  dllVendorFileName,
  dllAssetsName,
  webpackConfFileName,
} = constants

export function excludeJS(modulePath: string) {
  // Don't transpile node_modules except any @rtadmin npm package
  const isNodeModules = /node_modules/.test(modulePath)
  const notRtModules = /(@rtadmin)((?!node_modules).)*\.[j|t]sx?$/.test(modulePath)
  const isRtModules = isNodeModules && !notRtModules

  return isRtModules
}

type BaseConfigOptions = Props & Partial<DevCliOptions> & Partial<BuildCliOptions>
export function createBaseConfig(options: BaseConfigOptions): Configuration {
  const {
    outDir,
    srcDir,
    siteDir,
    publicPath,
    genDir,
    env,
    bundleAnalyzer,
    mock,
    siteConfig,
  } = options

  const isProd = process.env.NODE_ENV === 'production'

  const getDllDistFile = (type: string) => {
    const dllBasePath = `${publicPath}${dllVendorPath}/`
    const assetJson = require(`${siteDir}/${dllAssetsName}`)
    return `${dllBasePath}/${_.get(assetJson, `${dllVendorFileName}.${type}`)}`
  }

  const webpackConfig = {
    mode: isProd ? 'production' : 'development',
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
      assetFilter: (file) => {
        // Filter genDir files
        const isGen = file.startsWith(genDir)
        const isJs = file.endsWith('.js')
        return isJs && !isGen
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
      // We want `@docusaurus/core` own dependencies/`node_modules` to "win" if there is conflict
      // Example: if there is core-js@3 in user's own node_modules, but core depends on
      // core-js@2, we should use core-js@2.
      modules: [
        path.resolve(__dirname, '..', '..', 'node_modules'),
        'node_modules',
        path.resolve(fs.realpathSync(process.cwd()), 'node_modules'),
      ],
    },
    optimization: {
      runtimeChunk: true,
      removeAvailableModules: false,
      // Only minimize client bundle in production because server bundle is only used for static site generation
      minimize: isProd,
      minimizer: !isProd
        ? undefined
        : [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: !bundleAnalyzer,
              terserOptions: {
                parse: {
                  // we want uglify-js to parse ecma 8 code. However, we don't want it
                  // to apply any minfication steps that turns valid ecma 5 code
                  // into invalid ecma 5 code. This is why the 'compress' and 'output'
                  // sections only apply transformations that are ecma 5 safe
                  // https://github.com/facebook/create-react-app/pull/4234
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                },
                mangle: {
                  safari10: true,
                },
                output: {
                  ecma: 5,
                  comments: false,
                  // Turned on because emoji and regex is not minified properly using default
                  // https://github.com/facebook/create-react-app/issues/2488
                  ascii_only: true,
                },
              },
            }),
            new OptimizeCSSAssetsPlugin({
              cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
              },
            }),
          ],
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
        {
          test: /\.(j|t)sx?$/,
          exclude: excludeJS,
          use: [cacheLoader, babelLoader],
        },
        {
          test: /\.ts|tsx$/,
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
          test: /\.png|jpg|gif|ttf|woff|woff2|eot|svg$/,
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
      ],
    },
    plugins: [
      new LogPlugin({
        name: libName,
      }),
      new CleanPlugin(),
      new EnvironmentPlugin({
        MOCK: mock,
        ENV: env,
      }),
      fs.existsSync(`${siteDir}/${tsConfFileName}`) &&
        new TsCheckerPlugin({
          tsconfig: `${siteDir}/${tsConfFileName}`,
          tslint: !fs.existsSync(`${siteDir}/${tsLintConfFileName}`)
            ? undefined
            : `${siteDir}/${tsLintConfFileName}`,
          reportFiles: [`${srcDir}/src/**/*.{ts,tsx}`, `${siteDir}/typings/**/*.{ts,tsx}`],
          silent: true,
        }),
      new DllReferencePlugin({
        manifest: `${siteDir}/${dllManifestName}`,
      } as any),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash:6].css' : '[name].css',
        chunkFilename: isProd ? '[name].[contenthash:6].css' : '[name].css',
        // remove css order warnings if css imports are not sorted alphabetically
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422 for more reasoning
        ignoreOrder: true,
      }),
      new CopyPlugin([
        { from: `${siteDir}/${staticDirName}`, to: `${outDir}/${staticDirName}` },
        {
          from: path.resolve(siteDir, 'node_modules/amis/sdk/pkg'),
          to: `${generatedDirName}/${staticDirName}/pkg/[name].[ext]`,
          toType: 'template',
        },
        {
          from: `${generatedDirName}/${staticDirName}`,
          to: `${outDir}/${staticDirName}/${libName}`,
        },
      ]),
      new HtmlWebpackPlugin({
        publicPath,
        ..._.pick(siteConfig, ['title', 'favicon']),
        ..._.pick(siteConfig.template, ['head', 'postBody', 'preBody']),
        template: path.resolve(__dirname, './template.ejs'),
        filename: `${outDir}/index.html`,
        dllVendorCss: getDllDistFile('css'),
        dllVendorJs: getDllDistFile('js'),
      }),
    ].filter(Boolean) as any[],
  }

  if (!mock) {
    webpackConfig.module.rules.unshift({
      test: /[\\/]mock\.[t|j]sx?$/,
      use: 'null-loader',
      exclude: /node_modules/,
    } as any)
  }

  const realConfig = mergeWebpackConfig(webpackConfig, `${siteDir}/${webpackConfFileName}`)

  return realConfig
}
