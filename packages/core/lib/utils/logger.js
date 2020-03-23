/**
 * logger模块
 * 错误，异常等地方都应输入日志，给出提示
 */
// 默认所有日志均显示
let debugConfig = {
    level: 'log',
    moduleName: '',
    onlyLevel: false,
    enable: true,
    defaultDebugOption: {
        isPrint: true,
        moduleName: 'app*',
        onlySelf: false,
        level: 'log',
    },
};
let onlySelfFlag = null;
// 判断 生产环境
const isRelease = () => {
    return process.env.NODE_ENV === 'production' && !debugConfig.enable;
};
// 过滤日志打印信息
const filterLog = (option) => {
    const { level, moduleName, onlyLevel } = debugConfig;
    // 打包环境不打印LOG
    if (isRelease()) {
        return false;
    }
    const allowedLevel = [];
    if (onlyLevel) {
        // 仅仅打印当前级别的LOG
        allowedLevel.push(level);
    }
    else {
        // ERROR > WARN > INFO > LOG
        const allLevel = ['log', 'info', 'warn', 'error'];
        const idx = allLevel.findIndex((l) => l === level);
        allowedLevel.push(...allLevel.slice(idx));
    }
    // 过滤不同级别的 LOG
    if (!allowedLevel.find((l) => l === option.level)) {
        return false;
    }
    // 根据传入的 moduleName 过滤 日志
    if (!moduleName || !new RegExp(moduleName).test(option.moduleName)) {
        return false;
    }
    return true;
};
export class Logger {
    log(moduleName, ...loggerDetail) {
        this.debugLogger({ level: 'log', moduleName }, loggerDetail);
    }
    info(moduleName, ...loggerDetail) {
        this.debugLogger({ level: 'info', moduleName }, loggerDetail);
    }
    warn(moduleName, ...loggerDetail) {
        this.debugLogger({ level: 'warn', moduleName }, loggerDetail);
    }
    error(moduleName, ...loggerDetail) {
        this.debugLogger({ level: 'error', moduleName }, loggerDetail);
    }
    getLogger(moduleName, option = {}) {
        const debugOption = Object.assign(Object.assign({}, option), { moduleName });
        return {
            time: (label, timeFn) => this.time(label, timeFn, debugOption),
            if: (isPrint) => this.getLogger(moduleName, Object.assign(Object.assign({}, option), { isPrint })),
            log: (...logDetail) => this.signedLogger('log', debugOption, logDetail),
            info: (...logDetail) => this.signedLogger('info', debugOption, logDetail),
            warn: (...logDetail) => this.signedLogger('warn', debugOption, logDetail),
            error: (...logDetail) => this.signedLogger('error', debugOption, logDetail),
        };
    }
    time(label, timeFn, debugOption) {
        const start = Date.now();
        const result = timeFn();
        const end = Date.now();
        this.debugLogger.call(null, debugOption, [`${label || 'time'}: ${end - start}ms`, result]);
        return result;
    }
    debugLogger(option, loggerDetail) {
        // 打包环境不打印日志
        if (isRelease()) {
            return;
        }
        const debugOption = Object.assign(Object.assign({}, debugConfig.defaultDebugOption), option);
        const { moduleName, level, onlySelf } = debugOption;
        onlySelfFlag = null;
        // onlySelf 为 bool值时 设置 onlySelfFlag
        if (typeof onlySelf === 'boolean') {
            onlySelfFlag = onlySelf;
        }
        // onlySelfFlag === true && onlySelf === true  时直接打印
        // 否则 需要校验 moduleName 与 level 级别
        if ((!onlySelfFlag || !onlySelf) && !filterLog({ level, moduleName })) {
            return;
        }
        const now = new Date();
        const logArgs = [
            `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${level.toUpperCase()} ${moduleName}]__::`,
        ];
        const log = Function.prototype.bind.call(console[level] || console.log, console);
        log.apply(console, logArgs.concat(loggerDetail));
        // console.log('logArgs->', logArgs);
        // console.log.call(null, ...logArgs.concat(...loggerDetail)) // 该方法不兼容IE9-IE11
    }
    signedLogger(level, option, loggerDetail) {
        const { isPrint = true } = option;
        if (!isPrint) {
            return;
        }
        this.debugLogger.call(null, Object.assign(Object.assign({}, option), { level }), loggerDetail);
    }
}
const logger = new Logger();
// 设置 日志 配置
export const setConfig = (conf) => {
    debugConfig = Object.assign(Object.assign({}, debugConfig), conf);
    // 打包环境不打印日志
    if (isRelease()) {
        return;
    }
    logger.info('app:logger:config', debugConfig);
};
export default logger;
