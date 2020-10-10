declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '~/*'
declare module 'react-overlays'
declare module 'classnames'
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
  ovine: any // ovine 全局对象
}
