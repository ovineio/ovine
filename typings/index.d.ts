/// <reference path="custom_typings.d.ts" />
/// <reference path="./request.d.ts" />

declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'

declare module 'react-dom'
declare module 'react-router-dom'
declare module 'react-router-config'

declare const layui: any

declare function require(path: string): string

declare const process: {
  env: any
}
