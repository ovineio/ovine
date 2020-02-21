/**
 * 统一声明自定义类型
 */
declare namespace Types {
  type NumStr = number | string
  type NullValue = null | undefined
  type FalseValue = false | void | undefined | null | 0
  type Map<K extends string, V> = { [key in K]: V }
  type PartialMap<K extends string, V> = { [key in K]?: V }
  type ObjectOf<T> = { [key: string]: T }
  type MixObject<T, K> = K & Omit<T, keyof K>
  type Pair<T> = [T, T | undefined]
  type ValueCtrl<T = any> = (type: 'set' | 'get', value?: T) => T | undefined
  type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
}
