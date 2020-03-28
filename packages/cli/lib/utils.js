"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_extra_1 = __importDefault(require("fs-extra"));
var import_fresh_1 = __importDefault(require("import-fresh"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var constants_1 = require("./constants");
function normalizeUrl(rawUrls) {
    var urls = rawUrls;
    var resultArray = [];
    // If the first part is a plain protocol, we combine it with the next part.
    if (urls[0].match(/^[^/:]+:\/*$/) && urls.length > 1) {
        var first = urls.shift();
        urls[0] = first + urls[0];
    }
    // There must be two or three slashes in the file protocol,
    // two slashes in anything else.
    var replacement = urls[0].match(/^file:\/\/\//) ? '$1:///' : '$1://';
    urls[0] = urls[0].replace(/^([^/:]+):\/*/, replacement);
    // eslint-disable-next-line
    for (var i = 0; i < urls.length; i++) {
        var component = urls[i];
        if (typeof component !== 'string') {
            throw new TypeError("Url must be a string. Received " + typeof component);
        }
        if (component === '') {
            // eslint-disable-next-line
            continue;
        }
        if (i > 0) {
            // Removing the starting slashes for each component but the first.
            component = component.replace(/^[/]+/, '');
        }
        // Removing the ending slashes for each component but the last.
        // For the last component we will combine multiple slashes to a single one.
        component = component.replace(/[/]+$/, i < urls.length - 1 ? '' : '/');
        resultArray.push(component);
    }
    var str = resultArray.join('/');
    // Each input component is now separated by a single slash
    // except the possible first plain protocol part.
    // Remove trailing slash before parameters or hash.
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
    // Replace ? in parameters with &.
    var parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');
    // Dedupe forward slashes.
    str = str.replace(/^\/+/, '/');
    return str;
}
exports.normalizeUrl = normalizeUrl;
function compileWebpack(config) {
    return new Promise(function (resolve, reject) {
        var compiler = webpack_1["default"](config);
        compiler.run(function (err, stats) {
            if (err) {
                reject(err);
            }
            if (stats.hasErrors()) {
                stats.toJson('errors-only').errors.forEach(function (e) {
                    console.error(e);
                });
                reject(new Error('Failed to compile with errors.'));
            }
            if (stats.hasWarnings()) {
                stats.toJson('errors-warnings').warnings.forEach(function (warning) {
                    console.warn(warning);
                });
            }
            resolve();
        });
    });
}
exports.compileWebpack = compileWebpack;
function mergeWebpackConfig(baseConfig, config) {
    var webpackConfig = baseConfig;
    if (typeof config === 'object') {
        webpackConfig = webpack_merge_1["default"](baseConfig, config);
    }
    else if (typeof config === 'string' && fs_extra_1["default"].existsSync(config)) {
        webpackConfig = webpack_merge_1["default"](baseConfig, import_fresh_1["default"](config));
    }
    return webpackConfig;
}
exports.mergeWebpackConfig = mergeWebpackConfig;
var store = {};
function globalStore(type, key, value) {
    if (type === 'set') {
        lodash_1["default"].set(store, key, value);
        return undefined;
    }
    return lodash_1["default"].get(store, key, value);
}
exports.globalStore = globalStore;
function isCliDev() {
    return __dirname.indexOf(constants_1.libRootPath) > -1;
}
exports.isCliDev = isCliDev;
function getCliDevRootDir() {
    var rootPathIdx = __dirname.indexOf(constants_1.libRootPath);
    var devRootDir = __dirname.substring(0, rootPathIdx) + constants_1.libRootPath;
    return devRootDir;
}
exports.getCliDevRootDir = getCliDevRootDir;
function getModulePath(siteDir, lib, required) {
    if (required === void 0) { required = false; }
    var isDev = isCliDev();
    var devRootDir = getCliDevRootDir();
    var isLib = lib.indexOf('lib/') === 0;
    var libPath = !isLib ? lib : lib.split('lib/')[1];
    var prodPath = "node_modules/" + (!isLib ? '' : "@" + constants_1.libName + "/") + libPath;
    var libPaths = [
        siteDir + "/" + prodPath,
        path_1["default"].resolve(siteDir, "../../" + prodPath),
        path_1["default"].resolve(siteDir, "../../../../" + prodPath),
    ];
    if (isLib) {
        libPaths.push(devRootDir + "/packages/" + libPath);
    }
    if (isDev) {
        libPaths.push(devRootDir + "/" + prodPath);
    }
    var result = libPaths.filter(function (corePath) { return fs_extra_1["default"].pathExistsSync(corePath); })[0];
    if (!result && required) {
        throw new Error("Can not find path: " + lib + ".\nSearched paths:\n" + libPaths.join('\n'));
    }
    return result;
}
exports.getModulePath = getModulePath;
