"use strict";
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
var assets_webpack_plugin_1 = __importDefault(require("assets-webpack-plugin"));
var clean_webpack_plugin_1 = __importDefault(require("clean-webpack-plugin"));
var lodash_1 = __importDefault(require("lodash"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var webpack_1 = require("webpack");
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var constants = __importStar(require("../constants"));
var utils_1 = require("../utils");
var babel_1 = require("./babel");
var log_plugin_1 = __importDefault(require("./plugins/log_plugin"));
var chalk = require("chalk");
var webpackDllConfFileName = constants.webpackDllConfFileName, dllDirPath = constants.dllDirPath, dllVendorFileName = constants.dllVendorFileName, dllManifestFile = constants.dllManifestFile, dllAssetsFile = constants.dllAssetsFile, libName = constants.libName, staticLibDirPath = constants.staticLibDirPath;
var dllName = '[name]_[hash:6]';
var dllModules = [
    'react',
    'react-dom',
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
];
function setDllVendorModules(config) {
    var venderConfKey = "entry." + dllVendorFileName;
    var vendorModules = lodash_1["default"].get(config, venderConfKey);
    if (typeof vendorModules === 'undefined') {
        lodash_1["default"].set(config, venderConfKey, dllModules);
        return;
    }
    if (lodash_1["default"].isArray(vendorModules)) {
        lodash_1["default"].set(config, venderConfKey, lodash_1["default"].uniq(dllModules.concat(vendorModules)));
    }
    else {
        console.error(chalk.red('\nDll webpack config must set entry.vendor must function or array of module name...'));
        return;
    }
    if (lodash_1["default"].isFunction(vendorModules)) {
        var vendorDllModules = vendorModules(dllModules);
        if (lodash_1["default"].isArray(vendorDllModules)) {
            lodash_1["default"].set(config, venderConfKey, vendorDllModules);
        }
        else {
            console.error(chalk.red('\nDll webpack config entry.vendor function must return array of module name...'));
        }
    }
}
function createDllConfig(options) {
    var publicPath = options.publicPath, siteDir = options.siteDir, bundleAnalyzer = options.bundleAnalyzer;
    var babelLoader = {
        loader: 'babel-loader',
        options: babel_1.getDllBabelConfig(siteDir)
    };
    var dllConfig = {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /amis\/lib\/components\/Editor.js$/,
                    use: [
                        babelLoader,
                        {
                            loader: 'string-replace-loader',
                            options: {
                                search: 'function\\sfilterUrl\\(url\\)\\s\\{\\s*return\\s*url;',
                                flags: 'm',
                                replace: "function filterUrl(url) {return " + ("" + publicPath + staticLibDirPath) + " + url.substring(1);"
                            }
                        },
                    ]
                },
                {
                    test: /\.js|jsx$/,
                    use: [babelLoader]
                },
                {
                    test: /\.css$/,
                    use: [mini_css_extract_plugin_1["default"].loader, 'css-loader']
                },
                {
                    test: /\.png|jpg|gif|ttf|woff|woff2|eot|svg$/,
                    exclude: /qs\//,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                publicPath: "" + publicPath + dllDirPath + "/",
                                limit: 2000,
                                name: '[name]_[contenthash:6].[ext]'
                            }
                        },
                    ]
                },
            ]
        },
        output: {
            pathinfo: false,
            path: siteDir + "/" + dllDirPath,
            filename: dllName + ".js",
            chunkFilename: 'chunk_[name]_[chunkhash:6].js',
            library: dllName,
            publicPath: "" + publicPath + dllDirPath + "/"
        },
        plugins: [
            new log_plugin_1["default"]({
                name: libName + "-dll"
            }),
            new clean_webpack_plugin_1["default"](),
            new mini_css_extract_plugin_1["default"]({
                filename: dllName + ".css",
                chunkFilename: 'chunk_[name]_[chunkhash:6].css'
            }),
            new webpack_1.DllPlugin({
                path: siteDir + "/" + dllManifestFile,
                name: dllName
            }),
            // 把带hash的dll插入到html中 https://github.com/ztoben/assets-webpack-plugin
            new assets_webpack_plugin_1["default"]({
                filename: dllAssetsFile,
                fullPath: false,
                path: siteDir
            }),
        ],
        // 关闭文件大小报警，具体情况，可查看分析工具
        performance: {
            hints: false
        },
        optimization: {
            minimizer: [new terser_webpack_plugin_1["default"]()],
            splitChunks: {
                maxInitialRequests: Infinity,
                automaticNameDelimiter: '_',
                cacheGroups: {
                    "default": false,
                    vendors: false,
                    monacoLanguages: {
                        chunks: 'async',
                        name: 'monaco_languages',
                        test: /monaco-editor[\\/].*language/,
                        priority: 10,
                        minChunks: 1
                    }
                }
            }
        }
    };
    if (bundleAnalyzer) {
        dllConfig.plugins.push(
        // https://github.com/webpack-contrib/webpack-bundle-analyzer
        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin());
    }
    var config = utils_1.mergeWebpackConfig(dllConfig, siteDir + "/" + webpackDllConfFileName);
    setDllVendorModules(config);
    return config;
}
exports.createDllConfig = createDllConfig;
