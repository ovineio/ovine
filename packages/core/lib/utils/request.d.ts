/**
 * 封装 fetch 请求
 */
export declare function getUrlByOption(this: Req.Config, option: Req.Option & Partial<Req.Config>): {
    url: string;
    method: string;
};
export declare class Request<T = {}, K = {}> {
    domains: {
        [domain: string]: string;
    };
    isRelease?: boolean;
    onRequest?: (option: Req.UnionOption) => Req.UnionOption;
    userTokenCtrl?: (option: Req.Option) => Req.Option;
    onError?: (option: {
        option: Req.UnionOption;
        response: Response;
        error?: any;
    }) => any;
    onResponse?: (option: {
        option: Req.UnionOption;
        response: Response;
        source?: any;
    }) => any;
    onFinish?: (option: {
        option: Req.UnionOption;
        response: Response;
        error?: any;
        source?: any;
    }) => void;
    constructor(config?: Req.Config);
    setConfig(config?: Req.Config): void;
    request<S = {}, P = {}>(option: Types.MixObject<Req.Option<Types.MixObject<S, K>, P>, T>): Promise<Req.ServerApiRes<Types.MixObject<S, K>> | undefined>;
}
//# sourceMappingURL=request.d.ts.map