"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var package_json_1 = require("cache-loader/package.json");
var clean_webpack_plugin_1 = __importDefault(require("clean-webpack-plugin"));
var copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
var fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var lodash_1 = __importDefault(require("lodash"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var path_1 = __importDefault(require("path"));
var webpack_1 = require("webpack");
var config_1 = require("../config");
var constants = __importStar(require("../constants"));
var utils_1 = require("../utils");
var babel_1 = require("./babel");
var log_plugin_1 = __importDefault(require("./plugins/log_plugin"));
var libName = constants.libName, generatedDirName = constants.generatedDirName, staticDirName = constants.staticDirName, tsConfFileName = constants.tsConfFileName, tsLintConfFileName = constants.tsLintConfFileName, webpackConfFileName = constants.webpackConfFileName, dllVendorDirPath = constants.dllVendorDirPath, dllManifestFile = constants.dllManifestFile, dllVendorFileName = constants.dllVendorFileName, dllAssetsFile = constants.dllAssetsFile, staticLibDirPath = constants.staticLibDirPath, esLintFileName = constants.esLintFileName;
function createBaseConfig(options) {
    var outDir = options.outDir, srcDir = options.srcDir, genDir = options.genDir, siteDir = options.siteDir, publicPath = options.publicPath, env = options.env, bundleAnalyzer = options.bundleAnalyzer, mock = options.mock, siteConfig = options.siteConfig;
    var isProd = utils_1.globalStore('get', 'isProd') || false;
    var cacheLoader = {
        loader: 'cache-loader',
        options: {
            cacheIdentifier: "cache-loader:" + package_json_1.version
        }
    };
    var babelLoader = {
        loader: 'babel-loader',
        options: babel_1.getBabelConfig(siteDir)
    };
    var useTs = fs_extra_1["default"].existsSync(siteDir + "/" + tsConfFileName);
    var baseConfig = {
        mode: process.env.NODE_ENV,
        entry: [
            // Instead of the default WebpackDevServer client, we use a custom one
            // like CRA to bring better experience.
            !isProd && require.resolve('react-dev-utils/webpackHotDevClient'),
            srcDir + "/index",
        ].filter(Boolean),
        output: {
            // Use future version of asset emitting logic, which allows freeing memory of assets after emitting.
            publicPath: publicPath,
            futureEmitAssets: true,
            pathinfo: false,
            path: outDir,
            filename: isProd ? '[name]_[contenthash:6].js' : '[name].js',
            chunkFilename: isProd ? 'chunks/[name]_[contenthash:6].js' : 'chunks/[name].js'
        },
        // Don't throw warning when asset created is over 250kb
        performance: {
            maxEntrypointSize: 400 * 1000,
            maxAssetSize: 400 * 1000,
            assetFilter: function (filePath) {
                // Filter genDir or theme files
                var isLibFiles = /static\/rtadmin/.test(filePath);
                var isThemeStyles = /themes\/.*\.css/.test(filePath);
                return !isLibFiles && !isThemeStyles;
            }
        },
        // Omit not necessary stats log
        stats: {
            chunkModules: false,
            assets: false
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
                '@generated': genDir
            },
            // This allows you to set a fallback for where Webpack should look for modules.
            modules: [
                path_1["default"].resolve(__dirname, '..', '..', 'node_modules'),
                'node_modules',
                path_1["default"].resolve(fs_extra_1["default"].realpathSync(process.cwd()), 'node_modules'),
            ]
        },
        optimization: {
            runtimeChunk: {
                // https://github.com/webpack/webpack/issues/7875
                name: function (_a) {
                    var name = _a.name;
                    return "runtime_" + name;
                }
            },
            removeAvailableModules: false,
            // Only minimize client bundle in production because server bundle is only used for static site generation
            minimize: isProd,
            splitChunks: {
                // Since the chunk name includes all origin chunk names it’s recommended for production builds with long term caching to NOT include [name] in the filenames
                name: false,
                automaticNameDelimiter: '_',
                cacheGroups: {
                    "default": false,
                    vendors: false,
                    appVendor: {
                        chunks: 'all',
                        name: 'app_vendor',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 8,
                        minChunks: 1,
                        reuseExistingChunk: false
                    },
                    appCommon: {
                        chunks: 'all',
                        name: 'app_common',
                        priority: 7,
                        minChunks: 2
                    }
                }
            }
        },
        module: {
            rules: [
                !mock && {
                    test: /[\\/]mock\.[t|j]sx?$/,
                    use: 'null-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.jsx?$/,
                    exclude: excludeJS,
                    use: [cacheLoader, babelLoader]
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
                                transpileOnly: true
                            }
                        },
                    ]
                },
                {
                    test: /\.css$/,
                    use: (isProd ? [mini_css_extract_plugin_1["default"].loader] : [cacheLoader, 'style-loader']).concat([
                        'css-loader',
                    ])
                },
                {
                    test: new RegExp("\\." + ("png,jpg,gif,ttf,woff,woff2,eot,svg" + (!siteConfig.staticFileExt ? '' : "," + siteConfig.staticFileExt)).replace(/,/gi, '|') + "$"),
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                publicPath: publicPath,
                                limit: 2000,
                                name: !isProd
                                    ? '[path][name].[ext]'
                                    : function (modulePath) {
                                        var filePath = modulePath.replace(srcDir, '').replace('/assets', '');
                                        return "assets/" + path_1["default"].dirname(filePath) + "/[name]_[contenthash:6].[ext]";
                                    }
                            }
                        },
                    ]
                },
            ].filter(Boolean)
        },
        plugins: [
            new log_plugin_1["default"]({
                name: libName + "-" + (isProd ? 'build' : 'dev')
            }),
            new clean_webpack_plugin_1["default"](),
            getCopyPlugin(siteDir),
            new webpack_1.EnvironmentPlugin({
                PUBLIC_PATH: publicPath,
                NODE_ENV: process.env.NODE_ENV,
                MOCK: mock,
                ENV: env
            }),
            new webpack_1.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            useTs &&
                new fork_ts_checker_webpack_plugin_1["default"]({
                    tsconfig: siteDir + "/" + tsConfFileName,
                    eslint: fs_extra_1["default"].existsSync(siteDir + "/" + esLintFileName),
                    eslintOptions: fs_extra_1["default"].existsSync(siteDir + "/" + esLintFileName) &&
                        require(siteDir + "/" + esLintFileName),
                    tslint: !fs_extra_1["default"].existsSync(siteDir + "/" + tsLintConfFileName)
                        ? undefined
                        : siteDir + "/" + tsLintConfFileName,
                    reportFiles: [srcDir + "/src/**/*.{ts,tsx}", siteDir + "/typings/**/*.{ts,tsx}"],
                    silent: true
                }),
            new webpack_1.DllReferencePlugin({
                manifest: siteDir + "/" + dllManifestFile
            }),
            new mini_css_extract_plugin_1["default"]({
                filename: isProd ? '[name]_[contenthash:6].css' : '[name].css',
                chunkFilename: isProd ? 'chunks/[name]_[contenthash:6].css' : 'chunks/[name].css',
                // remove css order warnings if css imports are not sorted alphabetically
                // see https://github.com/webpack-contrib/mini-css-extract-plugin/pull/422 for more reasoning
                ignoreOrder: true
            }),
            new html_webpack_plugin_1["default"](__assign(__assign({}, lodash_1["default"].pick(siteConfig.template, ['head', 'postBody', 'preBody'])), { title: siteConfig.title, favIcon: siteConfig.favicon, staticLibPath: "" + publicPath + staticLibDirPath + "/", template: path_1["default"].resolve(__dirname, './template.ejs'), filename: outDir + "/index.html", dllVendorCss: getDllDistFile(siteDir, 'css'), dllVendorJs: getDllDistFile(siteDir, 'js') })),
        ].filter(Boolean)
    };
    var config = utils_1.mergeWebpackConfig(baseConfig, siteDir + "/" + webpackConfFileName);
    return config;
}
exports.createBaseConfig = createBaseConfig;
function excludeJS(modulePath) {
    // Don't transpile node_modules except any @rtadmin npm package
    var isNodeModules = /node_modules/.test(modulePath);
    var isLibModules = /node_modules\/@rtadmin\/.*\.[j|t]sx?$/.test(modulePath);
    return isLibModules ? false : isNodeModules;
}
function getDllDistFile(siteDir, type) {
    var publicPath = config_1.loadContext(siteDir).publicPath;
    var dllBasePath = "" + publicPath + dllVendorDirPath + "/";
    var assetJson = require(siteDir + "/" + dllAssetsFile);
    return "" + dllBasePath + lodash_1["default"].get(assetJson, dllVendorFileName + "." + type);
}
function getCopyPlugin(siteDir) {
    var outDir = config_1.loadContext(siteDir).outDir;
    var generatedStaticDir = siteDir + "/" + generatedDirName + "/" + staticDirName;
    var siteStaticDir = siteDir + "/" + staticDirName;
    var outStaticDir = outDir + "/" + staticDirName;
    var outLibDir = outDir + "/" + staticLibDirPath;
    var copyFiles = [
        {
            from: generatedStaticDir,
            to: outLibDir
        },
    ];
    if (fs_extra_1["default"].pathExistsSync(siteStaticDir)) {
        copyFiles.unshift({
            from: siteStaticDir,
            to: outStaticDir
        });
    }
    var amisPkg = utils_1.getModulePath(siteDir, 'amis/sdk/pkg');
    if (amisPkg) {
        copyFiles.unshift({
            from: amisPkg,
            to: outLibDir + "/pkg/[name].[ext]",
            toType: 'template'
        });
    }
    var coreStatic = utils_1.getModulePath(siteDir, 'lib/core/static');
    if (coreStatic) {
        copyFiles.unshift({
            from: coreStatic,
            to: outLibDir + "/core"
        });
    }
    return new copy_webpack_plugin_1["default"](copyFiles);
}
