/**
 * logger模块
 * 错误，异常等地方都应输入日志，给出提示
 */
declare type Level = 'log' | 'info' | 'warn' | 'error';
declare type Option = {
    isPrint?: boolean;
    moduleName?: string;
    level?: Level;
    onlySelf?: boolean;
};
declare type Config = {
    level: Level;
    enable: boolean;
    moduleName: string;
    onlyLevel: boolean;
    defaultDebugOption: Required<Option>;
};
export declare type LoggerConfig = Omit<Config, 'defaultDebugOption'>;
export declare class Logger {
    log(moduleName: string, ...loggerDetail: any[]): void;
    info(moduleName: string, ...loggerDetail: any[]): void;
    warn(moduleName: string, ...loggerDetail: any[]): void;
    error(moduleName: string, ...loggerDetail: any[]): void;
    getLogger(moduleName: string, option?: Option): {
        time: <T>(label: string, timeFn: () => T) => T;
        if: (isPrint: boolean) => any;
        log: (...logDetail: any[]) => void;
        info: (...logDetail: any[]) => void;
        warn: (...logDetail: any[]) => void;
        error: (...logDetail: any[]) => void;
    };
    private time;
    private debugLogger;
    private signedLogger;
}
declare const logger: Logger;
export declare const setConfig: (conf: Partial<Config>) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map