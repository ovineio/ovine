/**
 * 主题文件
 */

import defaultsDeep from 'lodash/defaultsDeep'

import { cxdTheme } from './cxd'
import { darkTheme } from './dark'
import { defaultTheme } from './def'

// TODO: 将 amis scss核变量 重新定义为 ts
const themes = {
  default: defaultTheme,
  // TODO: 制作自定主题 清新
  cxd: defaultsDeep(cxdTheme, defaultTheme),
  dark: defaultsDeep(darkTheme, defaultTheme),
}

export default themes
