import * as Req from "./request/types";
declare type MockListStoreOption<T = {}> = {
    generator: (index: number) => T;
    idField?: string;
    count?: number;
};
declare type Updater<T = {}> = Partial<T> | ((d: Partial<T>) => Partial<T>);
declare type OperationOption<S = {}, P = {}> = {
    updater?: Updater<S>;
    response?: Req.ReqServerApiRes<P>;
};
export declare class MockListStore<S = {}, P = S> {
    private list;
    private idField;
    constructor(option: MockListStoreOption<S>);
    getList(): S[];
    search(query?: (list: S[]) => S[]): S[];
    add(data: P, option: OperationOption<S, P>): Req.ReqServerApiRes<S>;
    updateById(data: P, option: OperationOption<S, P>): Req.ReqServerApiRes<S>;
    deleteById(data: P, option: OperationOption<S, P>): Req.ReqServerApiRes<S>;
    deleteBy(predicate: (data: P) => boolean, option: OperationOption<S, P>): Req.ReqServerApiRes<S>;
    private generator;
    private resolveOption;
    private getItemInfo;
    private getItemData;
}
export declare const mockResSuccess: <T>(data: T) => {
    data: T;
    code: number;
};
export declare const mockResError: (...args: any[]) => {
    code: any;
    msg: any;
    message: any;
    error: any;
};
export {};
