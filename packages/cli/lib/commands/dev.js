"use strict";
/**
 * dev command for webpack dev server
 */
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
var chokidar_1 = __importDefault(require("chokidar"));
var express_1 = __importDefault(require("express"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var portfinder_1 = __importDefault(require("portfinder"));
var WebpackDevServerUtils_1 = require("react-dev-utils/WebpackDevServerUtils");
var errorOverlayMiddleware_1 = __importDefault(require("react-dev-utils/errorOverlayMiddleware"));
var evalSourceMapMiddleware_1 = __importDefault(require("react-dev-utils/evalSourceMapMiddleware"));
var openBrowser_1 = __importDefault(require("react-dev-utils/openBrowser"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var HotModuleReplacementPlugin_1 = __importDefault(require("webpack/lib/HotModuleReplacementPlugin"));
var config_1 = require("../config");
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var base_1 = require("../webpack/base");
var chalk = require("chalk");
function dev(siteDir, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var context, siteConfig, publicPath, protocol, port, host, urls, openUrl, config, devServerConfig, compiler, devServer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.env.NODE_ENV = 'development';
                    process.env.BABEL_ENV = 'development';
                    utils_1.globalStore('set', 'isProd', false);
                    if (options.isReload) {
                        console.log(chalk.blue('\nConfig changed restart the development server...'));
                    }
                    else {
                        console.log(chalk.blue('\nStarting the development server...'));
                    }
                    context = config_1.loadContext(siteDir);
                    siteConfig = context.siteConfig, publicPath = context.publicPath;
                    protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
                    return [4 /*yield*/, getPort(options.port)];
                case 1:
                    port = _a.sent();
                    host = getHost(options.host);
                    urls = WebpackDevServerUtils_1.prepareUrls(protocol, host, port);
                    openUrl = utils_1.normalizeUrl([urls.localUrlForBrowser, publicPath]);
                    config = webpack_merge_1["default"](base_1.createBaseConfig(__assign(__assign({}, context), options)), {
                        plugins: [
                            // This is necessary to emit hot updates for webpack-dev-server.
                            new HotModuleReplacementPlugin_1["default"](),
                        ]
                    });
                    devServerConfig = {
                        host: host,
                        publicPath: publicPath,
                        compress: true,
                        clientLogLevel: 'error',
                        hot: true,
                        hotOnly: false,
                        quiet: true,
                        proxy: siteConfig.devServerProxy,
                        headers: {
                            'access-control-allow-origin': '*'
                        },
                        watchOptions: {
                            ignored: /node_modules/
                        },
                        historyApiFallback: {
                            rewrites: [{ from: /\/*/, to: publicPath }]
                        },
                        disableHostCheck: true,
                        overlay: false,
                        before: function (app, server) {
                            app.use(publicPath, express_1["default"].static(path_1["default"].resolve(siteDir, constants_1.staticDirName)));
                            app.use(evalSourceMapMiddleware_1["default"](server));
                            app.use(errorOverlayMiddleware_1["default"]());
                        }
                    };
                    compiler = webpack_1["default"](config);
                    devServer = new webpack_dev_server_1["default"](compiler, devServerConfig);
                    reloadDevServer({ devServer: devServer, siteDir: siteDir, cliOptions: options });
                    devServer.listen(port, host, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(chalk.yellow("\nurl: " + openUrl + "\nenv: " + options.env + "\nmock: " + options.mock + "\n"));
                        if (options.open) {
                            openBrowser_1["default"](openUrl);
                        }
                    });
                    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
                        process.on(sig, function () {
                            devServer.close();
                            process.exit();
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.dev = dev;
function getHost(reqHost) {
    return reqHost || 'localhost';
}
function getPort(reqPort) {
    return __awaiter(this, void 0, void 0, function () {
        var basePort, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    basePort = reqPort ? parseInt(reqPort, 10) : constants_1.defaultPort;
                    return [4 /*yield*/, portfinder_1["default"].getPortPromise({ port: basePort })];
                case 1:
                    port = _a.sent();
                    return [2 /*return*/, port];
            }
        });
    });
}
function reloadDevServer(options) {
    var siteDir = options.siteDir, devServer = options.devServer, cliOptions = options.cliOptions;
    var fsWatcher = chokidar_1["default"].watch([constants_1.configFileName, constants_1.webpackConfFileName, constants_1.babelConfigFileName], {
        cwd: siteDir,
        ignoreInitial: true
    });
    ['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(function (event) {
        fsWatcher.on(event, lodash_1["default"].throttle(function () {
            fsWatcher.close().then(function () {
                devServer.close(function () {
                    dev(siteDir, __assign(__assign({}, cliOptions), { isReload: true }));
                });
            });
        }, 1200));
    });
}
