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
exports.__esModule = true;
/**
 * babel-loader configuration
 */
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var constants_1 = require("../constants");
var _a = process.env.NODE_ENV, NODE_ENV = _a === void 0 ? 'development' : _a;
var styledComponents = {
    development: {
        displayName: true
    },
    production: {
        minify: true,
        pure: true,
        displayName: false
    }
};
var styledConfig = {
    styledComponents: styledComponents[NODE_ENV] || styledComponents.development
};
function importPlugin(moduleName, dirName) {
    if (dirName === void 0) { dirName = ''; }
    return [
        'babel-plugin-import',
        {
            libraryName: moduleName,
            libraryDirectory: '',
            camel2DashComponentName: false
        },
        dirName,
    ];
}
function extendsConfig(siteDir) {
    var configFile = path_1["default"].resolve(siteDir, constants_1.babelConfigFileName);
    if (!fs_extra_1["default"].existsSync(configFile)) {
        return {};
    }
    return {
        "extends": configFile
    };
}
// babel config https://babeljs.io/docs/en/options#sourcetype
function getBabelConfig(siteDir) {
    return __assign(__assign({}, extendsConfig(siteDir)), { presets: ['@babel/preset-env', '@babel/preset-react'], plugins: [
            'babel-plugin-macros',
            ['babel-plugin-styled-components', styledConfig],
            '@babel/plugin-syntax-dynamic-import',
            importPlugin('lodash'),
        ] });
}
exports.getBabelConfig = getBabelConfig;
function getDllBabelConfig(siteDir) {
    return __assign(__assign({}, extendsConfig(siteDir)), { compact: true, plugins: ['@babel/plugin-syntax-dynamic-import'] });
}
exports.getDllBabelConfig = getDllBabelConfig;
