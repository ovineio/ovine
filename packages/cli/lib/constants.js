"use strict";
exports.__esModule = true;
exports.libName = 'rtadmin';
exports.libRootPath = '/rt-admin';
exports.outDirName = 'dist';
exports.defaultPort = 7050;
exports.srcDirName = 'src';
exports.staticDirName = 'static';
exports.configFileName = exports.libName + ".config.js";
exports.generatedDirName = "." + exports.libName;
exports.staticLibDirPath = exports.staticDirName + "/" + exports.libName;
// scss
exports.stylesDirName = 'styles';
exports.scssDirName = 'scss';
exports.libThemes = ['default', 'cdx', 'dark'];
// dll config
exports.dllVendorFileName = 'vendor';
exports.dllVendorDirPath = exports.staticLibDirPath + "/dll";
exports.dllDirPath = exports.generatedDirName + "/" + exports.staticDirName + "/dll";
exports.dllManifestFile = exports.generatedDirName + "/dll_manifest.json";
exports.dllAssetsFile = exports.generatedDirName + "/dll_assets.json";
// config files
exports.webpackConfFileName = 'webpack.config.js';
exports.webpackDllConfFileName = 'webpack.dll.js';
exports.esLintFileName = '.eslintrc.js';
exports.tsLintConfFileName = 'tslint.json';
exports.tsConfFileName = 'tsconfig.json';
exports.babelConfigFileName = 'babel.config.js';
