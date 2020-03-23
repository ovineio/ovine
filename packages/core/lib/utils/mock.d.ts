declare type MockListStoreOption<T = {}> = {
    generator: (index: number) => T;
    idField?: string;
    count?: number;
};
declare type Updater<T = {}> = Partial<T> | ((d: Partial<T>) => Partial<T>);
declare type OperationOption<S = {}, P = {}> = {
    updater?: Updater<S>;
    response?: Req.ServerApiRes<P>;
};
export declare class MockListStore<S = {}, P = S> {
    private list;
    private idField;
    constructor(option: MockListStoreOption<S>);
    getList(): S[];
    search(query?: (list: S[]) => S[]): S[];
    add(data: P, option: OperationOption<S, P>): Req.ServerApiRes<S>;
    updateById(data: P, option: OperationOption<S, P>): Req.ServerApiRes<S>;
    deleteById(data: P, option: OperationOption<S, P>): Req.ServerApiRes<S>;
    deleteBy(predicate: (data: P) => boolean, option: OperationOption<S, P>): Req.ServerApiRes<S>;
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
//# sourceMappingURL=mock.d.ts.map