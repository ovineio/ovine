/**
 * 主题文件
 */

import { defaultsDeep } from 'lodash'

import { cxdTheme } from './cxd'
import { darkTheme } from './dark'
import { antdTheme } from './antd'
import { defaultTheme } from './def'

// TODO: 制作自定主题 清新

// TODO: 将 amis scss 主要变量 重新定义为 styled 变量
const themes = {
  default: defaultTheme,
  cxd: defaultsDeep(cxdTheme, defaultTheme),
  dark: defaultsDeep(darkTheme, defaultTheme),
  antd: defaultsDeep(antdTheme, defaultTheme),
}

export default themes
