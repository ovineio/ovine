declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '~/*'

declare module '@/assets/scripts/editor.min'

declare const $: any

declare module 'react-dom' {
  export const render: any
  export const createPortal: any
  export const findDOMNode: any
  export const unmountComponentAtNode: any
}
