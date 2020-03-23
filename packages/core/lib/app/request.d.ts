import { Request } from "../utils/request";
declare type ReqOptions = {
    url: string;
    api?: string;
};
export declare class AppRequest<T = {}, K = {}> extends Request<T & ReqOptions, K> {
}
export {};
//# sourceMappingURL=request.d.ts.map