/**
 * 主题文件入口
 */

import { DefaultTheme } from 'styled-components'

import { cxdTheme } from './cxd'
import { darkTheme } from './dark'
import { defaultTheme } from './def'
import { lightTheme } from './light'

const themes: Types.ObjectOf<DefaultTheme> = {
  cxd: cxdTheme,
  dark: darkTheme,
  default: defaultTheme,
  light: lightTheme,
}

export default themes
