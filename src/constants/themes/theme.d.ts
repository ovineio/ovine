import { DefaultTheme } from 'styled-components'

// 定义用到的主题变量
declare module 'styled-components' {
  export interface DefaultTheme { // tslint:disable-line
    ns: string
    name: string
    text: string
    // 颜色
    colors: {
      layoutHeaderBg: string
      linkHover: string
      border: string
    }
  }
}
