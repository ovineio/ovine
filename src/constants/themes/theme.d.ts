import { DefaultTheme } from 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme { // tslint:disable-line
    ns: string
    name: string
    text: string
    borderRadius: string
    colors: {
      main: string
      secondary: string
    }
  }
}
