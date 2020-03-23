/**
 * 公用的hooks 封装
 */
import produce from 'immer';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { subscribe, Handler } from "./message";
export function useImmer(initialValue) {
    const [val, updateValue] = useState(initialValue);
    return [
        val,
        useCallback((updater) => {
            updateValue(produce(updater));
        }, []),
    ];
}
export function useImmerReducer(reducer, initialState, initialAction) {
    const cachedReducer = useCallback(produce(reducer), [reducer]);
    return useReducer(cachedReducer, initialState, initialAction);
}
export function useSubscriber(key, handler) {
    useEffect(() => {
        const { unsubscribe } = subscribe(key, handler);
        return unsubscribe;
    }, [key]);
}
