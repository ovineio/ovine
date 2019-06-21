/// <reference path="custom_typings.d.ts" />
/// <reference path="./request.d.ts" />
/// <reference path="./logger.d.ts" />

declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '@assets/*'

declare module 'react-dom' {
  export const render: any
  export const createPortal: any
  export const setHotElementComparator: any
}
declare module 'react-router-dom' {
  export const Route: any
  export const Link: any
  export const BrowserRouter: any
  export const Redirect: any
  export const Switch: any
}

declare const layui: any
declare const $: any
declare function require(path: string): string
declare const process: {
  env: any
}
