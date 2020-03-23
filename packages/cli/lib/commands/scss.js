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
var child_process_1 = require("child_process");
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var shelljs_1 = __importDefault(require("shelljs"));
var constants_1 = require("../constants");
var utils_1 = require("../utils");
var chalk = require("chalk");
function scss(siteDir, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, verbose, _b, watch, nodeScssCmd, scssCmdOpts, amisScss, libScss, destStyles, siteScss, hasSiteScss, relativeDir, importer, useWatch, includePaths, resultFlag, logSuccess, libCmd, siteCmd;
        return __generator(this, function (_c) {
            _a = options.verbose, verbose = _a === void 0 ? false : _a, _b = options.watch, watch = _b === void 0 ? false : _b;
            nodeScssCmd = getNodeScssCmd();
            scssCmdOpts = { async: true, silent: !verbose };
            if (!nodeScssCmd) {
                console.log(chalk.yellowBright('You need install `node-sass` module as devDependencies or globally...'));
                return [2 /*return*/];
            }
            console.log(chalk.blue('Build scss to css files...'));
            amisScss = utils_1.getModulePath(siteDir, 'amis/scss/themes', true);
            libScss = utils_1.getModulePath(siteDir, "lib/core/" + constants_1.scssDirName, true);
            destStyles = siteDir + "/" + constants_1.generatedDirName + "/" + constants_1.stylesDirName;
            siteScss = siteDir + "/" + constants_1.scssDirName;
            hasSiteScss = fs_extra_1["default"].existsSync(siteScss);
            relativeDir = path_1["default"].relative(process.cwd(), destStyles);
            importer = "--importer " + path_1["default"].resolve(__dirname, '../scss_importer.js');
            useWatch = !watch ? '' : '--watch --recursive';
            includePaths = function (pathAr) { return pathAr.map(function (i) { return " --include-path " + i; }).join(' '); };
            resultFlag = [];
            logSuccess = function (type) {
                var logStr = "\n" + chalk.green('Success!') + " Generated css files in " + chalk.cyan(relativeDir) + ".\n";
                if (!hasSiteScss) {
                    console.log(logStr);
                    return;
                }
                resultFlag.push(type);
                if (resultFlag.length === 2) {
                    console.log(logStr);
                }
            };
            libCmd = nodeScssCmd + " " + libScss + " -o " + destStyles + " " + importer + " " + includePaths(!hasSiteScss ? [amisScss] : [amisScss, siteScss]);
            // console.log('libCmd===>\n', libCmd, '\n')
            shelljs_1["default"].exec(libCmd, scssCmdOpts, function (_, __, stderr) {
                if (stderr) {
                    console.error(chalk.red(stderr));
                    return;
                }
                copyFiles(libScss, destStyles);
                logSuccess('lib');
            });
            // build siteScss
            if (hasSiteScss) {
                siteCmd = nodeScssCmd + " " + siteScss + " -o " + destStyles + " " + importer + " " + useWatch + " " + includePaths([amisScss, libScss]);
                // console.log('siteCmd===>\n', siteCmd, '\n')
                shelljs_1["default"].exec(siteCmd, scssCmdOpts, function (_, __, stderr) {
                    if (stderr) {
                        console.error(chalk.red(stderr));
                        return;
                    }
                    copyFiles(siteScss, destStyles);
                    logSuccess('site');
                });
            }
            return [2 /*return*/];
        });
    });
}
exports.scss = scss;
function getNodeScssCmd() {
    var cmd = 'node-sass';
    try {
        child_process_1.execSync('node-sass -v', { stdio: 'ignore' });
        return cmd;
    }
    catch (_) {
        //
    }
    cmd = './node_modules/.bin/node-sass';
    try {
        child_process_1.execSync(cmd + " -v", { stdio: 'ignore' });
        return cmd;
    }
    catch (_) {
        //
    }
    return '';
}
function copyFiles(src, dest) {
    try {
        fs_extra_1["default"].copySync(src, dest, {
            filter: function (filePath) {
                var isLibDir = filePath.indexOf('core/scss/_lib') > -1;
                return !isLibDir && !/\.scss$/.test(filePath);
            }
        });
    }
    catch (e) {
        console.log(chalk.red(e));
        throw new Error(chalk.red('Copy files occurred error!'));
    }
}
