/**
 * 统一声明自定义类型
 */
export declare type NumStr = number | string;
export declare type NullValue = null | undefined;
export declare type FalseValue = false | void | undefined | null | 0;
export declare type Map<K extends string, V> = {
    [key in K]: V;
};
export declare type PartialMap<K extends string, V> = {
    [key in K]?: V;
};
export declare type ObjectOf<T> = {
    [key: string]: T;
};
export declare type MixObject<T, K> = K & Omit<T, keyof K>;
export declare type Pair<T> = [T, T | undefined];
export declare type ValueCtrl<T = any> = (type: 'set' | 'get', value?: T) => T | undefined;
export declare type DeepPartial<T> = {
    [K in keyof T]?: T[K] | DeepPartial<T[K]>;
};
export declare type ClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never;
export declare type AnyFunc = (...args: any[]) => any;
