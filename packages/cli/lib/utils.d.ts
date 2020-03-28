import { Configuration } from 'webpack';
export declare function normalizeUrl(rawUrls: string[]): string;
export declare function compileWebpack(config: Configuration): Promise<any>;
export declare function mergeWebpackConfig(baseConfig: any, config: string | object): Configuration;
export declare function globalStore<T = any>(type: 'get' | 'set', key: string, value?: T): T | undefined;
export declare function isCliDev(): boolean;
export declare function getCliDevRootDir(): string;
export declare function getModulePath(siteDir: string, lib: string, required?: boolean): string;
