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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
var path_1 = __importDefault(require("path"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var config_1 = require("../config");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var base_1 = require("../webpack/base");
var chalk = require("chalk");
function build(siteDir, cliOptions) {
    if (cliOptions === void 0) { cliOptions = {}; }
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var context, bundleAnalyzer, buildConfig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    process.env.BABEL_ENV = 'production';
                    process.env.NODE_ENV = 'production';
                    utils_1.globalStore('set', 'isProd', true);
                    console.log(chalk.blue('\nCreating an optimized production build...'));
                    context = config_1.loadContext(siteDir);
                    bundleAnalyzer = cliOptions.bundleAnalyzer;
                    buildConfig = utils_1.mergeWebpackConfig(base_1.createBaseConfig(__assign(__assign({}, context), cliOptions)), {
                        optimization: {
                            minimizer: [
                                new terser_webpack_plugin_1["default"]({
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
                                            ecma: 8
                                        },
                                        compress: {
                                            ecma: 5,
                                            warnings: false
                                        },
                                        mangle: {
                                            safari10: true
                                        },
                                        output: {
                                            ecma: 5,
                                            comments: false,
                                            // Turned on because emoji and regex is not minified properly using default
                                            // https://github.com/facebook/create-react-app/issues/2488
                                            ascii_only: true
                                        }
                                    }
                                }),
                                new optimize_css_assets_webpack_plugin_1["default"]({
                                    cssProcessorPluginOptions: {
                                        preset: ['default', { discardComments: { removeAll: true } }]
                                    }
                                }),
                            ]
                        }
                    });
                    if (bundleAnalyzer) {
                        (_a = buildConfig.plugins) === null || _a === void 0 ? void 0 : _a.push(new webpack_bundle_analyzer_1.BundleAnalyzerPlugin());
                    }
                    return [4 /*yield*/, utils_1.compileWebpack(buildConfig)];
                case 1:
                    _b.sent();
                    console.log("\n" + chalk.green('Success!') + " Generated bundle files in " + chalk.cyan(path_1["default"].relative(siteDir, constants_1.outDirName)) + ".\n");
                    return [2 /*return*/];
            }
        });
    });
}
exports.build = build;
