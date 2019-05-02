/**
 * 统一声明自定义类型
 */
declare namespace CustomTypes {
  type NumStr = number | string
  type NullValue = null | undefined
  type FalseValue = boolean | void | undefined | null
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
  type ObjectOf<T> = { [key: string]: T }
  type Pair<T> = [T, T | undefined]
}
