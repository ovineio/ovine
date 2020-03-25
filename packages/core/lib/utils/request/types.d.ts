export declare type ReqMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD';
export declare type ReqSuccessHook<S = {}, P = {}> = (source: ReqServerApiRes<S>, unionOption: ReqUnionOption<S, P>) => ReqServerApiRes<S>;
export declare type ReqErrorHook<S = {}, P = {}> = (option: {
    source?: ReqServerApiRes<S>;
    option?: ReqUnionOption<S, P>;
    error?: any;
}) => void;
export declare type ReqFetchOption = Omit<RequestInit, 'method'> & {
    url: string;
    method: ReqMethod;
    headers?: any;
    body?: any;
};
export declare type ReqUnionOption<S = {}, P = {}> = ReqOption<S, P> & ReqFetchOption;
export declare type ReqMockSource<S = {}, P = {}> = {
    [key: string]: ReqMockSourceGen<S, P>;
};
export declare type ReqOption<S = {}, P = {}> = {
    api: string;
    url?: string;
    method?: ReqMethod;
    domain?: string;
    data?: Partial<P>;
    headers?: HeadersInit;
    body?: BodyInit | null;
    token?: 'none' | 'auto' | 'force';
    sourceKey?: string;
    expired?: number;
    fetchOption?: Omit<RequestInit, 'header' | 'body'>;
    mock?: boolean;
    mockSource?: ReqMockSourceGen;
    mockTimeout?: number;
    onSuccess?: ReqSuccessHook<S, P>;
    onError?: ReqErrorHook<S, P>;
};
export declare type ReqMockSourceGen<S = {}, P = {}> = ((options: ReqUnionOption<S, P>) => object) | ReqServerApiRes<S>;
export declare type ReqServerApiRes<T> = T & {
    code?: number;
    data?: T;
    msg?: string;
    message?: string;
    error?: any;
};
export declare type ReqConfig = {
    domains: {
        [domain: string]: string;
    };
    isRelease?: boolean;
};
export declare type ReqMixObject<T, K> = K & Omit<T, keyof K>;
