/**
 * 主题文件入口
 */

import { DefaultTheme } from 'styled-components'

import { cxdTheme } from './cxd'
import { darkTheme } from './dark'
import { defaultTheme } from './def'
import { lightTheme } from './light'

// TODO: 将 amis scss核变量 重新定义为 ts
const themes: Types.ObjectOf<DefaultTheme> = {
  default: defaultTheme,
  light: lightTheme,
  cxd: cxdTheme,
  dark: darkTheme,
}

export default themes
