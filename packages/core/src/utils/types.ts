/**
 * 统一声明自定义类型
 */

export type NumStr = number | string
export type NullValue = null | undefined
export type FalseValue = false | void | undefined | null | 0
export type Map<K extends string, V> = { [key in K]: V }
export type PartialMap<K extends string, V> = { [key in K]?: V }
export type ObjectOf<T> = { [key: string]: T }
export type MixObject<T, K> = K | Omit<T, keyof K>
export type Pair<T> = [T, T | undefined]
export type ValueCtrl<T = any> = (type: 'set' | 'get', value?: T) => T | undefined
export type DeepPartial<T> = { [K in keyof T]?: T[K] | DeepPartial<T[K]> }
export type ClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never
export type AnyFunc = (...args: any[]) => any
