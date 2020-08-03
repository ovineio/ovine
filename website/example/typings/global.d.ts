declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'

declare module '@generated' // .ovine/*

interface Window {
  BEFORE_OVINE_CREATE: any // 页面全局函数hook
  AFTER_OVINE_CREATED: any // 页面全局函数hook
}
