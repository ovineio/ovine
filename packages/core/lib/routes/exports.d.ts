/**
 * 路由相关工具函数
 * 所有异步加载文件
 */
import { PageFileOption, PagePreset } from "./types";
export declare function getRoutePath(path: string): string;
export declare function getPageFilePath(option: PageFileOption): string;
export declare function getPagePreset(option: PageFileOption): PagePreset | undefined;
export declare function getPageMockSource(option: PageFileOption): Req.MockSource | undefined;
export declare function getThemeCss(theme: string): Promise<void>;
export declare function getPageFileAsync(option: PageFileOption): Promise<any>;
export declare function getNodePath(option: PageFileOption): string;
export declare function currPath(path?: string, defaultPath?: string): string;
//# sourceMappingURL=exports.d.ts.map