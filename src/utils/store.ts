/**
 * 项目用到的全局数据存储模块
 */

const globalData: any = {}

export type SessionKey = 'ROUTES_NAV_TABS'

/**
 * TODO:
 * 1. 添加缓存过期时间
 */
export function setStorage<K extends string>(key: K, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorage<K extends string, T>(key: K): T | undefined {
  let value = localStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setSessionStorage(key: SessionKey, value: any): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStorage<T>(key: SessionKey): T | undefined {
  let value = sessionStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setGlobal(key: string, value: any): void {
  globalData[key] = value
}

export function getGlobal<K extends string, T>(key: K): T | undefined {
  const value = globalData[key]

  return value
}
