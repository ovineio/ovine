/**
 * 扩展 styled 主题变量
 * ---
 * 可根据项目需要 修改或者添加 styled 变量
 * 也可以添加一个新主题
 * 主题相关文档: https://ovine.igroupes.com/org/docs/advance/theme
 */

import { AppTheme } from '@core/app/theme'

import cxdTheme from './themes/cxd'
import darkTheme from './themes/dark'
import antdTheme from './themes/antd'
import defaultTheme from './themes/def'

export const theme = new AppTheme({
  default: defaultTheme,
  cxd: cxdTheme,
  dark: darkTheme,
  antd: antdTheme,
})
