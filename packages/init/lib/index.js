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
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = require("child_process");
var figlet_1 = __importDefault(require("figlet"));
var fs_1 = __importDefault(require("fs"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var inquirer_1 = __importDefault(require("inquirer"));
var ora_1 = __importDefault(require("ora"));
var path_1 = __importDefault(require("path"));
var shelljs_1 = __importDefault(require("shelljs"));
var spinner = ora_1["default"]();
var libName = 'rtadmin';
function init(rootDir, siteName) {
    return __awaiter(this, void 0, void 0, function () {
        var useYarn, libDir, templatesDir, templates, gitChoice, templateChoices, name, promptedName, dest, template, promptedTemplate, gitRepoUrl, useTs, useLint, err_1, pkgManager, cdPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    useYarn = hasYarn();
                    libDir = path_1["default"].resolve(__dirname, '..');
                    templatesDir = libDir + "/templates";
                    templates = fs_1["default"]
                        .readdirSync(templatesDir)
                        .filter(function (d) { return !d.startsWith('.') && !d.startsWith('README'); });
                    gitChoice = 'Git repository';
                    templateChoices = __spreadArrays(templates, [gitChoice]);
                    name = siteName;
                    logBanner();
                    if (!!name) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer_1["default"].prompt({
                            type: 'input',
                            name: 'name',
                            message: 'What should we name this site?',
                            "default": 'admin'
                        })];
                case 1:
                    promptedName = (_a.sent()).name;
                    name = promptedName;
                    _a.label = 2;
                case 2:
                    if (!name) {
                        throw new Error(chalk_1["default"].red('A site name is required'));
                    }
                    dest = path_1["default"].resolve(rootDir, name);
                    if (fs_extra_1["default"].existsSync(dest)) {
                        throw new Error("Directory already exists at " + dest + " !");
                    }
                    template = '';
                    if (!!template) return [3 /*break*/, 4];
                    return [4 /*yield*/, inquirer_1["default"].prompt({
                            type: 'list',
                            name: 'template',
                            message: 'Select a template below...',
                            choices: templateChoices
                        })];
                case 3:
                    promptedTemplate = (_a.sent()).template;
                    template = promptedTemplate;
                    _a.label = 4;
                case 4:
                    if (!(template === gitChoice)) return [3 /*break*/, 6];
                    return [4 /*yield*/, inquirer_1["default"].prompt({
                            type: 'input',
                            name: 'gitRepoUrl',
                            validate: function (url) {
                                if (url && isValidGitRepoUrl(url)) {
                                    return true;
                                }
                                return chalk_1["default"].red('Invalid repository URL');
                            },
                            message: 'Enter a repository URL from GitHub, BitBucket, GitLab, or any other public repo. \n(e.g: https://github.com/ownerName/repoName.git)'
                        })];
                case 5:
                    gitRepoUrl = (_a.sent()).gitRepoUrl;
                    template = gitRepoUrl;
                    _a.label = 6;
                case 6:
                    if (template && isValidGitRepoUrl(template)) {
                        logStartCreate(false);
                        console.log("Cloning Git template: " + chalk_1["default"].cyan(template));
                        if (shelljs_1["default"].exec("git clone --recursive " + template + " " + dest, { silent: true }).code !== 0) {
                            throw new Error(chalk_1["default"].red("Cloning Git template: " + template + " failed!"));
                        }
                    }
                    if (!template || !templates.includes(template)) {
                        throw new Error('Invalid template');
                    }
                    return [4 /*yield*/, inquirer_1["default"].prompt({
                            type: 'confirm',
                            name: 'useTs',
                            message: 'Whether to use typescript?',
                            "default": false
                        })];
                case 7:
                    useTs = (_a.sent()).useTs;
                    return [4 /*yield*/, inquirer_1["default"].prompt({
                            type: 'confirm',
                            name: 'useLint',
                            message: 'Do you need eslint?',
                            "default": true
                        })];
                case 8:
                    useLint = (_a.sent()).useLint;
                    logStartCreate(true);
                    try {
                        // copy basic files
                        copyDirSync(templatesDir + "/" + template, dest, function (currItem) {
                            var reg = useTs ? /\.tsx?$/ : /\.jsx?$/;
                            var isDir = currItem.indexOf('.') === -1;
                            return isDir || reg.test(currItem);
                        });
                        // copy env files
                        copyDirSync(libDir + "/env", dest, function (currItem) {
                            if (
                            // ts not copy es_**/ files
                            (useTs && /^es_/.test(currItem)) ||
                                // es not copy ts_**/ files
                                (!useTs && /^ts_/.test(currItem)) ||
                                // without eslint not copy *_constraint/** files
                                (!useLint && /_constraint$/.test(currItem))) {
                                return false;
                            }
                            // delete the es_*,ts_* dir name
                            if (/(_constraint|_normal)$/.test(currItem)) {
                                return '';
                            }
                            return true;
                        });
                    }
                    catch (err) {
                        spinner.fail(chalk_1["default"].red('Copying template files failed!'));
                        throw err;
                    }
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, updatePkg(dest + "/package.json", {
                            name: name,
                            version: '0.0.0',
                            private: true
                        })];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    err_1 = _a.sent();
                    spinner.fail(chalk_1["default"].red('Failed to update package.json'));
                    throw err_1;
                case 12:
                    if (!(!fs_extra_1["default"].pathExistsSync(path_1["default"].join(dest, '.gitignore')) &&
                        fs_extra_1["default"].pathExistsSync(path_1["default"].join(dest, 'gitignore')))) return [3 /*break*/, 14];
                    return [4 /*yield*/, fs_extra_1["default"].move(path_1["default"].join(dest, 'gitignore'), path_1["default"].join(dest, '.gitignore'))];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14:
                    if (fs_extra_1["default"].pathExistsSync(path_1["default"].join(dest, 'gitignore'))) {
                        fs_extra_1["default"].removeSync(path_1["default"].join(dest, 'gitignore'));
                    }
                    pkgManager = useYarn ? 'yarn' : 'npm';
                    cdPath = path_1["default"].join(process.cwd(), name) === dest ? name : path_1["default"].relative(process.cwd(), name);
                    spinner.succeed(chalk_1["default"].green("Success! Created " + chalk_1["default"].cyan(cdPath)));
                    console.log();
                    console.log();
                    console.log('Inside that directory, you can run several commands:');
                    console.log();
                    console.log(chalk_1["default"].cyan("  " + pkgManager + " dev"));
                    console.log('    Starts the development server.');
                    console.log();
                    console.log(chalk_1["default"].cyan("  " + pkgManager + " " + (useYarn ? '' : 'run ') + "build"));
                    console.log('    Bundles the app into static files for production.');
                    console.log();
                    console.log('We suggest that you begin by typing:');
                    console.log();
                    console.log(chalk_1["default"].cyan('  cd'), cdPath);
                    console.log("  " + chalk_1["default"].cyan(pkgManager + " install"));
                    console.log("  " + chalk_1["default"].cyan(pkgManager + " dev"));
                    console.log();
                    console.log('Happy hacking!');
                    console.log();
                    return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
function hasYarn() {
    try {
        child_process_1.execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    }
    catch (e) {
        return false;
    }
}
function isValidGitRepoUrl(gitRepoUrl) {
    return ['https://', 'git@'].some(function (item) { return gitRepoUrl.startsWith(item); });
}
function copyDirSync(src, dest, handle) {
    fs_extra_1["default"].ensureDirSync(dest);
    fs_1["default"].readdirSync(src).forEach(function (item) {
        var itemPath = src + "/" + item;
        var stat = fs_1["default"].statSync(itemPath);
        var handleRes = handle ? handle(item, src) : item;
        if (handleRes === false) {
            return;
        }
        var destName = typeof handleRes === 'string' ? handleRes : item;
        if (stat.isDirectory()) {
            copyDirSync(itemPath, dest + "/" + destName, handle);
        }
        else if (stat.isFile()) {
            var destFile = dest + "/" + destName;
            spinner.text = chalk_1["default"].grey("Created file: " + destFile);
            fs_extra_1["default"].copyFileSync(itemPath, destFile);
        }
    });
}
function logStartCreate(showSpinner) {
    var startStr = 'Creating new project...';
    console.log();
    if (showSpinner) {
        spinner = spinner.start(chalk_1["default"].cyan(startStr));
    }
    else {
        console.log(chalk_1["default"].cyan(startStr));
    }
    console.log();
}
function logBanner() {
    console.log();
    console.log(figlet_1["default"].textSync(libName.toLocaleUpperCase()));
    console.log();
    console.log(chalk_1["default"].blue("Welcome to use " + libName + " template builder ~"));
    console.log();
}
function updatePkg(pkgPath, obj) {
    return __awaiter(this, void 0, void 0, function () {
        var content, pkg, newPkg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1["default"].readFile(pkgPath, 'utf-8')];
                case 1:
                    content = _a.sent();
                    pkg = JSON.parse(content);
                    newPkg = Object.assign(pkg, obj);
                    return [4 /*yield*/, fs_extra_1["default"].outputFile(pkgPath, JSON.stringify(newPkg, null, 2))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
