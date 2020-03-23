"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
 *   scss importer
 */
var fs_extra_1 = __importDefault(require("fs-extra"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("./constants");
var utils_1 = require("./utils");
/* eslint-disable react/no-this-in-sfc */
function getSassUrlVariants(url, extensions) {
    if (extensions === void 0) { extensions = ['.scss']; }
    var parsedUrl = path_1["default"].parse(url);
    var urlVariants = [url];
    if (parsedUrl.dir && !parsedUrl.ext) {
        extensions.forEach(function (extension) {
            urlVariants.push(path_1["default"].join(parsedUrl.dir, "" + parsedUrl.name + extension));
            urlVariants.push(path_1["default"].join(parsedUrl.dir, "_" + parsedUrl.name + extension));
        });
    }
    return urlVariants;
}
function logIncludePaths(content) {
    var flag = 'isLogIncludePaths';
    if (!utils_1.globalStore('get', flag)) {
        console.log('sass paths content:\n', content, '\n');
        utils_1.globalStore('set', flag, true);
    }
}
function getIncludePaths(pathStr, prev) {
    var includePaths = [];
    if (path_1["default"].isAbsolute(prev)) {
        includePaths.push(path_1["default"].dirname(prev));
    }
    return __spreadArrays(includePaths, pathStr.split(path_1["default"].delimiter));
}
var alias = {
    '@lib/': './_lib/',
    '@amis/': '../'
};
function importer(url, prev) {
    var _a = this.options, includePaths = _a.includePaths, file = _a.file;
    var contextPaths = getIncludePaths(includePaths, prev);
    if (utils_1.isCliDev()) {
        logIncludePaths({ includePaths: includePaths, contextPaths: contextPaths });
    }
    var urlAlias = Object.keys(alias).find(function (i) { return url.indexOf(i) === 0; });
    var realUrl = !urlAlias ? url : url.replace(urlAlias, alias[urlAlias]);
    var libScss = utils_1.getModulePath(__dirname, "lib/core/" + constants_1.scssDirName, true);
    var isLibScss = file.indexOf(libScss) > -1;
    var isSiteGlobal = url.indexOf('_global.scss') > -1;
    // libScss not check file exists
    if (isLibScss || isSiteGlobal) {
        var filePath = lodash_1["default"].flatten(contextPaths.map(function (dir) { return getSassUrlVariants(realUrl).map(function (item) { return path_1["default"].resolve(dir, item); }); })).find(function (item) {
            return fs_extra_1["default"].existsSync(item);
        });
        return (!filePath && {
            file: '',
            contents: ''
        });
    }
    // replace url alias
    if (urlAlias) {
        return {
            file: realUrl
        };
    }
    return null;
}
module.exports = importer;
