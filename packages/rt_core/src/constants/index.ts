/**
 * 项目内常量,禁止重新赋值修改
 */

export const publicUrl = '/'
export const logoUrl = `${publicUrl}static/images/logo.png`
export const testCodeUrl = `${publicUrl}static/images/test_code.jpeg`
export const userTokenError = 'USER_TOKEN_ERROR'
export const routeLimitKey = '$page'
export const themeNamePrefix = 'app-theme-'
export const appRootId = 'app-root'

// 屏幕尺寸定义
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

// 消息通知相关的 key
export const message = {
  storeRoot: '$store/',
  layoutSpinner: '$store/layoutSpinner',
  appTheme: 'appThemeMessage',
  appLang: 'appLangMessage'
}

// 存储相关的 key
export const storage = {
  userInfo: 'userInfoStore',
  appTheme: 'appThemeStore',
  appLimit: 'appLimitStore'
}