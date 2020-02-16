/// <reference path="../src/constants/themes/theme.d.ts" />

declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '~/assets/*'

declare module 'react-overlays'

declare module 'react-dom' {
  export const render: any
  export const createPortal: any
}

declare module 'react-hot-loader/root' {
  export const hot: any
}

declare const $: any
