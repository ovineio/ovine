/**
 * 封装 fetch 请求
 */
import { MixObject } from "../types";
import * as Types from "./types";
export declare function getUrlByOption(this: Types.ReqConfig, option: Types.ReqOption & Partial<Types.ReqConfig>): {
    url: string;
    method: string;
};
export declare class Request<T = {}, K = {}> {
    domains: {
        [domain: string]: string;
    };
    isRelease?: boolean;
    onRequest?: (option: Types.ReqUnionOption) => Types.ReqUnionOption;
    userTokenCtrl?: (option: Types.ReqOption) => Types.ReqOption;
    onError?: (option: {
        option: Types.ReqUnionOption;
        response: Response;
        error?: any;
    }) => any;
    onResponse?: (option: {
        option: Types.ReqUnionOption;
        response: Response;
        source?: any;
    }) => any;
    onFinish?: (option: {
        option: Types.ReqUnionOption;
        response: Response;
        error?: any;
        source?: any;
    }) => void;
    constructor(config?: Types.ReqConfig);
    setConfig(config?: Types.ReqConfig): void;
    request<S = {}, P = {}>(option: MixObject<Types.ReqOption<MixObject<S, K>, P>, T>): Promise<Types.ReqServerApiRes<MixObject<S, K>> | undefined>;
}
