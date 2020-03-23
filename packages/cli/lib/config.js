"use strict";
/**
 * load & check site config
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
exports.__esModule = true;
var fs_extra_1 = __importDefault(require("fs-extra"));
var import_fresh_1 = __importDefault(require("import-fresh"));
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("./constants");
var requiredFields = ['publicPath', 'favicon', 'title'];
var optionalFields = ['envModes', 'template', 'staticFileExt', 'devServerProxy'];
var defaultConfig = {
    template: {},
    devServerProxy: {}
};
function formatFields(fields) {
    return fields.map(function (field) { return "'" + field + "'"; }).join(', ');
}
function loadConfig(siteDir) {
    var configPath = path_1["default"].resolve(siteDir, constants_1.configFileName);
    if (!fs_extra_1["default"].existsSync(configPath)) {
        throw new Error(constants_1.configFileName + " not found");
    }
    var loadedConfig = import_fresh_1["default"](configPath);
    var missingFields = requiredFields.filter(function (field) { return !lodash_1["default"].has(loadedConfig, field); });
    if (missingFields.length > 0) {
        throw new Error("The required field(s) " + formatFields(missingFields) + " are missing from " + constants_1.configFileName);
    }
    // Merge default config with loaded config.
    var config = __assign(__assign({}, defaultConfig), loadedConfig);
    // Don't allow unrecognized fields.
    var allowedFields = __spreadArrays(requiredFields, optionalFields);
    var unrecognizedFields = Object.keys(config).filter(function (field) { return !allowedFields.includes(field); });
    if (unrecognizedFields.length) {
        throw new Error("The field(s) " + formatFields(unrecognizedFields) + " are not recognized in " + constants_1.configFileName);
    }
    return config;
}
exports.loadConfig = loadConfig;
function loadContext(siteDir) {
    var genDir = path_1["default"].resolve(siteDir, constants_1.generatedDirName);
    var siteConfig = loadConfig(siteDir);
    var outDir = path_1["default"].resolve(siteDir, constants_1.outDirName);
    var srcDir = path_1["default"].resolve(siteDir, constants_1.srcDirName);
    var publicPath = siteConfig.publicPath;
    return {
        siteDir: siteDir,
        genDir: genDir,
        siteConfig: siteConfig,
        outDir: outDir,
        srcDir: srcDir,
        publicPath: publicPath
    };
}
exports.loadContext = loadContext;
