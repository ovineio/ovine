/**
 * 统一声明自定义类型
 */
declare namespace Types {
  type NumStr = number | string
  type NullValue = null | undefined
  type FalseValue = boolean | void | undefined | null
  type Map<K extends string, V> = { [key in K]: V }
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
  type ObjectOf<T> = { [key: string]: T }
  type Pair<T> = [T, T | undefined]
  type StoreCtrl<T = any> = (type: 'set' | 'get', value?: T) => T | undefined
}
