import AssetsPlugin from 'assets-webpack-plugin'
import { version as cacheLoaderVersion } from 'cache-loader/package.json'
import CleanPlugin from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import TsCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import fse from 'fs-extra'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import _, { pick } from 'lodash'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { Configuration, DllReferencePlugin, EnvironmentPlugin, ProvidePlugin } from 'webpack'

import { loadContext } from '../config'
import * as constants from '../constants'
import { BuildCliOptions, DevCliOptions, Props } from '../types'
import { mergeWebpackConfig, globalStore, getModulePath } from '../utils'

import * as amis from './amis'
import { getBabelConfig } from './babel'
import HtmlHooksPlugin from './plugins/html_hooks_plugin'
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
  cssAssetsFile,
} = constants

type BaseConfigOptions = Props & Partial<DevCliOptions> & Partial<BuildCliOptions>
export function createBaseConfig(options: BaseConfigOptions): Configuration {
  const {
    outDir,
    srcDir,
    genDir,
    siteDir,
    publicPath,
    env,
    bundleAnalyzer,
    mock,
    siteConfig,
    dll = true,
    scssUpdate = false,
  } = options

  const { envModes, initTheme } = siteConfig

  // "envModes" must contains "env"
  if (envModes && env && !envModes.includes(env)) {
    throw new Error(
      `env: "${env}" is not allowed. The "env" must be one of "envModes": ${envModes}.`
    )
  }

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

  const useTs = fse.existsSync(`${siteDir}/${tsConfFileName}`)

  const baseConfig = {
    mode: process.env.NODE_ENV,
    entry: [
      // Instead of the default WebpackDevServer client, we use a custom one
      // like CRA to bring better experience.
      // !isProd && require.resolve('react-dev-utils/webpackHotDevClient'),
      'react-hot-loader/patch',
      // `${srcDir}/index`,
      `${getModulePath(siteDir, 'lib/core/lib/app/entry.js', true)}`,
    ].filter(Boolean) as string[],
    output: {
      // Use future version of asset emitting logic, which allows freeing memory of assets after emitting.
      publicPath,
      futureEmitAssets: true,
      pathinfo: false,
      path: outDir,
      filename: isProd ? '[name]_[contenthash:6].js' : '[name].js',
      chunkFilename: isProd ? 'chunks/[name]_[contenthash:6].js' : 'chunks/[name].js',
    },
    // throw warning when asset created is over 1.5 M
    performance: {
      maxEntrypointSize: 1500 * 1024,
      maxAssetSize: 1024 * 1024,
      assetFilter: (filePath) => {
        // Filter genDir or theme files
        const isLibFiles = /static[\\/]ovine/.test(filePath)
        const isThemeStyles = /themes[\\/].*\.css/.test(filePath)
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
        '@generated': genDir,
        '@core': '@ovine/core/lib',
        'react-dom': '@hot-loader/react-dom',
      },
      // This allows you to set a fallback for where Webpack should look for modules.
      modules: [
        'node_modules',
        path.resolve(__dirname, '../../node_modules'),
        path.resolve(fse.realpathSync(process.cwd()), 'node_modules'),
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
        automaticNameDelimiter: '_',
        minSize: 0,
        chunks: 'all',
        cacheGroups: {
          default: false, // disabled default configuration
          vendors: false, // disabled splitChunks vendors configuration
          appVendor: {
            chunks: 'all',
            name: 'app_vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          appCommon: {
            chunks: 'all',
            test: /[\\/]src[\\/]((?!pages).*)/,
            name: 'app_common',
            priority: 19,
            minChunks: 2,
            reuseExistingChunk: true,
          },
          pages: {
            chunks: 'async',
            test: /[\\/]src[\\/]pages[\\/]((?!preset).*)/,
            priority: 18,
            minChunks: 1,
            enforce: true,
            // test: (mod: any) => {
            //   const isPages = /[\\/]src[\\/]pages[\\/]((?!preset).*)/.test(mod.context)
            //   return isPages
            // },
            // reuseExistingChunk: true,
            name: (mod: any) => {
              const resolvedPath = mod.context.match(/[\\/]src[\\/]pages[\\/](.*)$/)
              const commonName = 'pages_common'
              const { splitCodeRoutes } = siteConfig

              let modPath = commonName

              // resolvedPath[1] is not with ".ext", value is `pages/${resolvedPath[1]}`
              if (resolvedPath && _.isArray(splitCodeRoutes)) {
                splitCodeRoutes.some(({ test, name }) => {
                  if (!(test instanceof RegExp) || !name || !test.test(resolvedPath[1])) {
                    return false
                  }
                  modPath = name // `p_${resolvedPath[1].replace(/[\\/]/g, '_')}`
                  return true
                })
              }

              return modPath
            },
          },
          // pagePresets: {
          //   chunks: 'all',
          //   name: 'page_presets',
          //   test: /[\\/]src[\\/]pages[\\/].*[\\/]preset\.[j|t]sx?$/,
          //   priority: 18,
          //   minChunks: 1,
          //   reuseExistingChunk: true,
          // },
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
        {
          test: amis.editorFileReg,
          use: [babelLoader, amis.fixEditorLoader({ publicPath })],
        },
        {
          test: amis.factoryFileReg,
          use: [babelLoader, amis.fixFactoryLoader()],
        },
        {
          test: amis.froalaEditorReg,
          use: [babelLoader, amis.fixFroalaLoader()],
        },
        {
          test: amis.videoFileReg,
          use: [babelLoader, amis.fixVideoLoader()],
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
          exclude: scssUpdate ? undefined : /\.ovine[\\/]styles[\\/]themes/,
        },
        !scssUpdate && {
          test: /\.ovine[\\/]styles[\\/]themes[\\/].*\.css$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath,
                limit: 1, // always use url, instate of base64
                name: `${staticDirName}/${libName}/themes/[name]_[contenthash:6].css`,
              },
            },
            'extract-loader',
            'css-loader',
          ],
        },
        {
          test: /\.svg$/, // svg loader for tsx/jsx files
          issuer: /\.[t|j]sx$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.svg$/, // svg loader for ts/js/css styled files
          issuer: [/\.css$/, /\.[t|j]s$/],
          use: [
            {
              loader: 'url-loader',
              options: {
                publicPath: publicPath,
                limit: 2000,
                name: !isProd ? '[path][name].[ext]' : 'assets/svgs/[name]_[contenthash:6].[ext]',
              },
            },
          ],
        },
        {
          test: new RegExp(
            `\\.${`(gif,png,jpg,ttf,ico,woff,woff2,eot${
              !siteConfig.staticFileExts ? '' : `,${siteConfig.staticFileExts}`
            }`.replace(/,/gi, '|')})$`
          ),
          exclude: [/[\\/]qs[\\/]/],
          use: [
            {
              loader: 'url-loader',
              options: {
                publicPath,
                limit: 2000, // less than 2kb files use base64 url
                name: !isProd
                  ? '[path][name].[ext]'
                  : (modulePath) => {
                      const pathAr = modulePath
                        .split('/')
                        .filter((i) => i !== 'assets')
                        .slice(-2)
                      return `assets/${path.dirname(pathAr.join('/'))}/[name]_[contenthash:6].[ext]`
                    },
              },
            },
          ],
        },
      ].filter(Boolean) as any[],
    },
    plugins: [
      new LogPlugin({
        name: `${libName}-${isProd ? 'Build' : 'Dev'}`,
      }),
      new CleanPlugin(),
      getCopyPlugin(siteDir),
      new EnvironmentPlugin({
        PUBLIC_PATH: publicPath,
        NODE_ENV: process.env.NODE_ENV,
        INIT_THEME: initTheme || 'default',
        MOCK: mock,
        ENV: env,
      }),
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      useTs &&
        new TsCheckerPlugin({
          tsconfig: `${siteDir}/${tsConfFileName}`,
          eslint: fse.existsSync(`${siteDir}/${esLintFileName}`),
          eslintOptions:
            fse.existsSync(`${siteDir}/${esLintFileName}`) &&
            require(`${siteDir}/${esLintFileName}`),
          tslint: !fse.existsSync(`${siteDir}/${tsLintConfFileName}`)
            ? undefined
            : `${siteDir}/${tsLintConfFileName}`,
          reportFiles: ['src/**/*.{ts,tsx}', 'typings/**/*.{ts,tsx}'],
          silent: true,
        }),
      dll &&
        new DllReferencePlugin({
          manifest: `${siteDir}/${dllManifestFile}`.replace('[name]', dllVendorFileName),
        } as any),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name]_[contenthash:6].css' : '[name].css',
        chunkFilename: isProd ? 'chunks/[name]_[contenthash:6].css' : 'chunks/[name].css',
        // remove css order warnings if css imports are not sorted alphabetically
        // see https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422 for more reasoning
        ignoreOrder: true,
      }),
      !scssUpdate &&
        new AssetsPlugin({
          manifestFirst: true,
          keepInMemory: !isProd,
          includeAllFileTypes: false,
          fileTypes: ['css'],
          filename: cssAssetsFile.split('/')[1],
          fullPath: false,
          path: `${siteDir}/${cssAssetsFile.split('/')[0]}`,
        }),
      !scssUpdate &&
        new HtmlHooksPlugin({
          keepInMemory: !isProd,
          indexHtml: `${outDir}/index.html`,
          getThemeScript: (opts: any) => getThemeScript({ siteDir, initTheme, ...opts }),
        }),
      new HtmlWebpackPlugin({
        ..._.pick(siteConfig.template, ['head', 'postBody', 'preBody']),
        isProd,
        scssUpdate,
        title: siteConfig.title,
        favIcon: siteConfig.favicon,
        staticLibPath: `${publicPath}${staticLibDirPath}/`,
        template: path.resolve(__dirname, './template.ejs'),
        filename: `${outDir}/index.html`,
        dllVendorCss: getDllDistFile(siteDir, 'css'),
        dllVendorJs: dll && getDllDistFile(siteDir, 'js'),
      }),
    ].filter(Boolean) as any[],
  }

  const config = mergeWebpackConfig(baseConfig, `${siteDir}/${webpackConfFileName}`)

  return config
}

function excludeJS(modulePath: string) {
  // exclude fixed amis file
  const regs = ['editorFileReg', 'factoryFileReg', 'froalaEditorReg', 'videoFileReg']
  if (Object.values(pick(amis, regs)).some((reg: any) => reg.test(modulePath))) {
    return true
  }

  // Don't transpile node_modules except any @ovine npm package
  const isNodeModules = /node_modules/.test(modulePath)
  const isLibModules = /node_modules[\\/]@ovine[\\/].*\.[j|t]sx?$/.test(modulePath)

  return isLibModules ? false : isNodeModules
}

function getDllDistFile(siteDir: string, type: string) {
  const { publicPath } = loadContext(siteDir)
  const dllBasePath = `${publicPath}${dllVendorDirPath}/`

  const dllFile = `${siteDir}/${dllAssetsFile.replace('[name]', dllVendorFileName)}`
  const assetJson = fse.existsSync(dllFile) && require(dllFile)

  if (!assetJson) {
    return ''
  }

  return `${dllBasePath}${_.get(assetJson, `${dllVendorFileName}.${type}`)}`
}

function getCopyPlugin(siteDir: string) {
  const { outDir } = loadContext(siteDir)

  const generatedStaticDir = `${siteDir}/${generatedDirName}/${staticDirName}`
  const siteStaticDir = `${siteDir}/${staticDirName}`
  const outStaticDir = `${outDir}/${staticDirName}`
  const outLibDir = `${outDir}/${staticLibDirPath}`

  const copyFiles: any = [
    {
      from: generatedStaticDir,
      to: outLibDir,
    },
  ]

  if (fse.pathExistsSync(siteStaticDir)) {
    copyFiles.unshift({
      from: siteStaticDir,
      to: outStaticDir,
    })
  }

  const amisPkg = getModulePath(siteDir, 'amis/sdk/pkg')
  if (amisPkg) {
    copyFiles.unshift({
      from: amisPkg,
      to: `${outLibDir}/pkg/[name].[ext]`,
      toType: 'template',
    })
  }

  const coreStatic = getModulePath(siteDir, 'lib/core/static')
  if (coreStatic) {
    copyFiles.unshift({
      from: coreStatic,
      to: `${outLibDir}/core`,
    })
  }

  return new CopyPlugin(copyFiles)
}

function getThemeScript(options: any) {
  const { siteDir, localFs, initTheme } = options

  const { publicPath } = loadContext(siteDir)
  const assetsJson = JSON.parse(localFs.readFileSync(`${siteDir}/${cssAssetsFile}`, 'utf8'))
  const cssAssets = _.get(assetsJson, '.css') || []
  const themes = cssAssets.map((i) => `${publicPath}${i}`)

  let presetTheme = ''
  if (initTheme) {
    if (themes.some((theme) => theme.indexOf(`themes/${initTheme}`) > -1)) {
      presetTheme = initTheme
    }
  }

  if (!themes.length) {
    return ''
  }

  return `
    <script>
      (function() {
        var themes = "${themes}".split(',');
        var theme = (localStorage.getItem('libAppThemeStore') || '').replace(/"/g, '') || '${presetTheme}' || 'default';
        var currThemeLink = '';
        for (var i = 0; i < themes.length; i++) {
          if (themes[i].indexOf('themes/'+theme) > -1) {
            currThemeLink = themes[i];
            break;
          }
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        head.appendChild(link);
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.dataset.theme = theme;
        link.href= currThemeLink;
      })();
    </script>
  `.replace(/\n\s{2,}/g, '')
}
