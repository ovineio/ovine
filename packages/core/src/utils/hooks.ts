/**
 * 公用的hooks 封装
 */
import produce, { Draft } from 'immer'
import { useCallback, useRef, useEffect, useReducer, useState } from 'react'

import { subscribe, Handler } from './message'
import { AnyFunc } from './types'

export type Reducer<S = any, A = any> = (draftState: Draft<S>, action: A) => void | S

export type ImmerSetter<S> = (f: (draft: Draft<S>) => void | S) => void

export function useImmer<S = any>(initialValue: S | (() => S)): [S, ImmerSetter<S>]
export function useImmer(initialValue: any) {
  const [val, updateValue] = useState(initialValue)
  return [
    val,
    useCallback((updater) => {
      updateValue(produce(updater))
    }, []),
  ]
}

export function useImmerReducer<S = any, A = any>(
  reducer: Reducer<S, A>,
  initialState: S,
  initialAction?: (initial: any) => S
): [S, React.Dispatch<A>]
export function useImmerReducer(reducer: any, initialState: any, initialAction: any) {
  const cachedReducer = useCallback(produce(reducer), [reducer])
  return useReducer(cachedReducer, initialState as any, initialAction)
}

export function useSubscriber<T>(key: string | string[], handler: Handler<T>) {
  useEffect(() => {
    const { unsubscribe } = subscribe(key, handler)
    return unsubscribe
  }, [key])
}

export function usePersistFn<T extends AnyFunc>(fn: T) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call function while rendering.')
  })

  ref.current = fn

  const persistFn = useCallback(((...args) => ref.current(...args)) as T, [ref])

  return persistFn
}
