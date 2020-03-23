import _ from 'lodash';
import { Configuration } from 'webpack';
export declare function generate(generatedFilesDir: string, file: string, content: any, skipCache?: boolean): Promise<void>;
export declare function objectWithKeySorted(obj: object): _.Dictionary<any>;
/**
 * Convert filepath to url path.
 * Example: 'index.md' -> '/', 'foo/bar.js' -> '/foo/bar',
 */
export declare function fileToPath(file: string): string;
export declare function encodePath(userPath: string): string;
/**
 * Given an input string, convert to kebab-case and append a hash.
 * Avoid str collision.
 */
export declare function genFileHash(str: string): string;
/**
 * Convert Windows backslash paths to posix style paths.
 * E.g: endi\\lie -> endi/lie
 */
export declare function posixPath(str: string): string;
export declare function idx(target: any, keyPaths?: string | Array<string | number>): any;
/**
 * Given a filepath and dirpath, get the first directory.
 */
export declare function getSubFolder(file: string, refDir: string): string | null;
export declare function normalizeUrl(rawUrls: string[]): string;
/**
 * Alias filepath relative to site directory, very useful so that we
 * don't expose user's site structure.
 * Example: some/path/to/website/docs/foo.md -> @site/docs/foo.md
 */
export declare function aliasedSitePath(filePath: string, siteDir: string): string;
export declare function normalizeToSiteDir(filePath: any, siteDir: any): string;
export declare function compileWebpack(config: Configuration): Promise<any>;
export declare function mergeWebpackConfig(baseConfig: any, config: string | object): Configuration;
export declare function globalStore<T = any>(type: 'get' | 'set', key: string, value?: T): T | undefined;
export declare function isCliDev(): boolean;
export declare function getCliDevRootDir(): string;
export declare function getModulePath(siteDir: string, lib: string, required?: boolean): string;
//# sourceMappingURL=utils.d.ts.map