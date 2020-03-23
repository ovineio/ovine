/// <reference types="react" />
/**
 * 公用的hooks 封装
 */
import { Draft } from 'immer';
import { Handler } from "./message";
export declare type Reducer<S = any, A = any> = (draftState: Draft<S>, action: A) => void | S;
export declare type ImmerSetter<S> = (f: (draft: Draft<S>) => void | S) => void;
export declare function useImmer<S = any>(initialValue: S | (() => S)): [S, ImmerSetter<S>];
export declare function useImmerReducer<S = any, A = any>(reducer: Reducer<S, A>, initialState: S, initialAction?: (initial: any) => S): [S, React.Dispatch<A>];
export declare function useSubscriber<T>(key: string | string[], handler: Handler<T>): void;
//# sourceMappingURL=hooks.d.ts.map