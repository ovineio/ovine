/**
 * 项目用到的全局数据存储模块
 * TODO: 添加缓存过期时间
 */
export declare function setStore(key: string, value: any): void;
export declare function clearStore(key: string): void;
export declare function getStore<T>(key: string): T | undefined;
export declare function setSessionStore(key: string, value: any): void;
export declare function getSessionStore<T>(key: string): T | undefined;
export declare function setGlobal(key: string, value: any): void;
export declare function getGlobal<T>(key: string): T | undefined;
//# sourceMappingURL=store.d.ts.map