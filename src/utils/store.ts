/**
 * 项目用到的全局数据存储模块
 */

const globalData: any = {}

/**
 * TODO:
 * 1. 添加缓存过期时间
 * 2. 增加cookie选项，与向下cookie兼容
 */
export function setStorage<K extends string>(key: K, value: any): void {
  if (!window.localStorage) {
    return
  }
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorage<K extends string, T>(key: K): T | CustomTypes.NullValue {
  if (!window.localStorage) {
    return
  }
  let value = localStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setSessionStorage(key: string, value: any): void {
  if (!window.sessionStorage) {
    return
  }
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStorage<K extends string, T>(key: K): T | CustomTypes.NullValue {
  if (!window.sessionStorage) {
    return
  }
  let value = sessionStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setGlobal(key: string, value: any): void {
  globalData[key] = value
}

export function getGlobal<K extends string, T>(key: K): T | CustomTypes.NullValue {
  const value = globalData[key]

  return value
}
