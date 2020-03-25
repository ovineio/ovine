/**
 * 实现消息通知逻辑
 * 解耦组件状态依赖
 */
declare type Key = string | string[];
export declare type Handler<T = any> = (data: T, key?: string) => void;
export declare const store: any;
export declare const publish: <T>(key: Key, value: T) => void;
export declare const unsubscribe: (key: Key, handler: Handler<any>) => void;
export declare const subscribe: (key: Key, handler: Handler<any>) => {
    key: Key;
    unsubscribe: () => void;
};
export declare const subscribeOnce: <T>(key: string, handler: Handler<any>) => void;
export {};
