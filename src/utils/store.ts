/**
 * 项目用到的全局数据存储模块
 * TODO: 添加缓存过期时间
 */

const globalData: any = {}

export function setStore(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function clearStore(key: string): void {
  localStorage.removeItem(key)
}

export function getStore<T>(key: string): T | undefined {
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

export function getGlobalStore<T>(key: string): T | undefined {
  const value = globalData[key]

  return value
}
