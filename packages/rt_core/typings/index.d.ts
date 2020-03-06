/// <reference path='../src/utils/request.d.ts' />

declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '~/*'

declare module 'react-overlays'

declare module 'whatwg-fetch'
declare module 'react-dom' {
  export const render: any
  export const createPortal: any
  export const unmountComponentAtNode: any
}
declare const $: any
