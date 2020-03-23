/// <reference types="react" />
/**
 * 模版替换字符串 {}
 * @param template String 待替换字符串
 * @param data Object 数据对象
 */
export declare const templateReplace: (template: string, data: Types.ObjectOf<any>) => string;
/**
 * 日期格式化字符串
 * @param formatter String  模版字符串
 * @param dateString? String 日期字符串
 */
export declare const formatDate: (formatter: string, date?: string | Date | undefined) => string;
/**
 * 从数组中随机抽取一个
 * @param source 参数数组
 */
export declare const choice: (source: any[]) => any;
export declare function isExpired(expiredTime: string | number, baseTime?: number): boolean;
/**
 * 解析 querystring 为 json 格式数据
 * @param key 需要获取的数据 json[key], 不传为整个json
 * @param url 待解析的url 默认为location.href
 */
export declare function getQuery(key: string, url?: string): undefined | string;
/**
 * 重试异步操作, 主要用于网络异常，导致文件找不到报错 load chunk error
 * @param promiseFn 需要异步操作部分
 * @param retriesLeft 最多尝试的次数, 默认5次
 * @param interval 重试间隔，默认间隔1.5秒
 */
export declare function retryPromise<T>(promiseFn: () => Promise<T>, retriesLeft?: number, interval?: number): Promise<T>;
/**
 * 是否是子串
 * @param source 模版字符串
 * @param check 待检验字符串
 * @param pos 需要校验的子串位置
 */
export declare function isSubStr(source: string, check: string, pos?: number): boolean;
export declare function cls(...args: any[]): string;
export declare function changeDomCls($dom: HTMLElement | undefined, type: 'add' | 'remove', clsName?: string): void;
export declare function timeout(ms: number): Promise<unknown>;
export declare function json2reactFactory(mapper: Types.ObjectOf<any> | ((type: string, props?: any) => any)): (schema: string | number | {
    [prop: string]: any;
    type: string;
    children?: any;
}) => string | number | import("react").ReactElement<{}, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)> | null;
//# sourceMappingURL=tool.d.ts.map