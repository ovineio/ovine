/**
 * 项目用到的全局数据存储模块
 */

const globalData: any = {}

/**
 * TODO:
 * 1. 添加缓存过期时间
 */

export function setStore<K extends string>(key: K, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStore<K extends string, T>(key: K): T | undefined {
  let value = localStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setSessionStore(key: string, value: any): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStore<T>(key: string): T | undefined {
  let value = sessionStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setGlobalStore(key: string, value: any): void {
  globalData[key] = value
}

export function getGlobalStore<K extends string, T>(key: K): T | undefined {
  const value = globalData[key]

  return value
}
