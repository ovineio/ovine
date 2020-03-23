"use strict";
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
var crypto_1 = require("crypto");
var escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var constants_1 = require("./constants");
var fileHash = new Map();
function generate(generatedFilesDir, file, content, skipCache) {
    if (skipCache === void 0) { skipCache = process.env.NODE_ENV === 'production'; }
    return __awaiter(this, void 0, void 0, function () {
        var filePath, lastHash, lastContent, currentHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = path_1["default"].join(generatedFilesDir, file);
                    if (!skipCache) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].dirname(filePath))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs_extra_1["default"].writeFile(filePath, content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    lastHash = fileHash.get(filePath);
                    if (!(!lastHash && fs_extra_1["default"].existsSync(filePath))) return [3 /*break*/, 5];
                    return [4 /*yield*/, fs_extra_1["default"].readFile(filePath, 'utf8')];
                case 4:
                    lastContent = _a.sent();
                    lastHash = crypto_1.createHash('md5')
                        .update(lastContent)
                        .digest('hex');
                    fileHash.set(filePath, lastHash);
                    _a.label = 5;
                case 5:
                    currentHash = crypto_1.createHash('md5')
                        .update(content)
                        .digest('hex');
                    if (!(lastHash !== currentHash)) return [3 /*break*/, 8];
                    return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].dirname(filePath))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, fs_extra_1["default"].writeFile(filePath, content)];
                case 7:
                    _a.sent();
                    fileHash.set(filePath, currentHash);
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.generate = generate;
function objectWithKeySorted(obj) {
    // https://github.com/lodash/lodash/issues/1459#issuecomment-253969771
    return lodash_1["default"](obj)
        .toPairs()
        .sortBy(0)
        .fromPairs()
        .value();
}
exports.objectWithKeySorted = objectWithKeySorted;
var indexRE = /(^|.*\/)index\.(js|jsx|ts|tsx)$/i;
var extRE = /\.(md|js)$/;
/**
 * Convert filepath to url path.
 * Example: 'index.md' -> '/', 'foo/bar.js' -> '/foo/bar',
 */
function fileToPath(file) {
    if (indexRE.test(file)) {
        return file.replace(indexRE, '/$1');
    }
    return "/" + file.replace(extRE, '').replace(/\\/g, '/');
}
exports.fileToPath = fileToPath;
function encodePath(userPath) {
    return userPath
        .split('/')
        .map(function (item) { return encodeURIComponent(item); })
        .join('/');
}
exports.encodePath = encodePath;
/**
 * Given an input string, convert to kebab-case and append a hash.
 * Avoid str collision.
 */
function genFileHash(str) {
    if (str === '/') {
        return 'index';
    }
    var shortHash = crypto_1.createHash('md5')
        .update(str)
        .digest('hex')
        .substr(0, 3);
    return lodash_1["default"].snakeCase(str) + "_" + shortHash;
}
exports.genFileHash = genFileHash;
/**
 * Convert Windows backslash paths to posix style paths.
 * E.g: endi\\lie -> endi/lie
 */
function posixPath(str) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(str);
    var hasNonAscii = /[^\u0000-\u0080]+/.test(str); // eslint-disable-line
    if (isExtendedLengthPath || hasNonAscii) {
        return str;
    }
    return str.replace(/\\/g, '/');
}
exports.posixPath = posixPath;
function idx(target, keyPaths) {
    return (target &&
        keyPaths &&
        (Array.isArray(keyPaths)
            ? keyPaths.reduce(function (obj, key) { return obj && obj[key]; }, target)
            : target[keyPaths]));
}
exports.idx = idx;
/**
 * Given a filepath and dirpath, get the first directory.
 */
function getSubFolder(file, refDir) {
    var separator = escape_string_regexp_1["default"](path_1["default"].sep);
    var baseDir = escape_string_regexp_1["default"](path_1["default"].basename(refDir));
    var regexSubFolder = new RegExp("" + baseDir + separator + "(.*?)" + separator + ".*");
    var match = regexSubFolder.exec(file);
    return match && match[1];
}
exports.getSubFolder = getSubFolder;
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
/**
 * Alias filepath relative to site directory, very useful so that we
 * don't expose user's site structure.
 * Example: some/path/to/website/docs/foo.md -> @site/docs/foo.md
 */
function aliasedSitePath(filePath, siteDir) {
    var relativePath = path_1["default"].relative(siteDir, filePath);
    // Cannot use path.join() as it resolves '../' and removes
    // the '@site'. Let webpack loader resolve it.
    return "@site/" + relativePath;
}
exports.aliasedSitePath = aliasedSitePath;
function normalizeToSiteDir(filePath, siteDir) {
    if (filePath && path_1["default"].isAbsolute(filePath)) {
        return posixPath(path_1["default"].relative(siteDir, filePath));
    }
    return posixPath(filePath);
}
exports.normalizeToSiteDir = normalizeToSiteDir;
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
    else if (fs_extra_1["default"].existsSync(config)) {
        webpackConfig = webpack_merge_1["default"](baseConfig, require(config));
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
