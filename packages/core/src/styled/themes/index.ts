/**
 * 主题文件
 */

import { defaultsDeep } from 'lodash'

import { defaultTheme } from './ang'
import { antdTheme } from './antd'
import { cxdTheme } from './cxd'
import { darkTheme } from './dark'

// TODO: 制作自定主题 清新

// TODO: 将 amis scss 主要变量 重新定义为 styled 变量
const themes = {
  ang: defaultTheme,
  // default: defaultsDeep(cxdTheme, defaultTheme),
  cxd: defaultsDeep(cxdTheme, defaultTheme),
  dark: defaultsDeep(darkTheme, defaultTheme),
  antd: defaultsDeep(antdTheme, defaultTheme),
}

export default themes
