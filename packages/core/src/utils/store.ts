/**
 * 项目用到的全局数据存储模块
 * TODO: 1. 添加缓存过期时间 2. 添加 undefined 兼容处理
 */

const globalData: any = {}

export function setStore(key: string, value: any = ''): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function clearStore(key: string): void {
  localStorage.removeItem(key)
}

export function getStore<T>(key: string): T | null {
  let value = localStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setSessionStore(key: string, value: any = ''): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStore<T>(key: string): T | null {
  let value = sessionStorage.getItem(key)

  if (value) {
    value = JSON.parse(value)
  }

  return value as any
}

export function setGlobal(key: string, value: any): void {
  globalData[key] = value
}

export function getGlobal<T>(key: string): T | undefined {
  const value = globalData[key]

  return value
}
