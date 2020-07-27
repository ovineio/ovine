declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '~/*'
declare module 'react-overlays'
declare module 'whatwg-fetch'
declare module 'react-hot-loader'
declare module 'qs'

declare const $: any

declare module 'react-dom' {
  export const render: any
  export const createPortal: any
  export const unmountComponentAtNode: any
}

interface Window {
  LAZY_FILE_CONTENT: any // 加载远程页面schema的全局中转变量
}
