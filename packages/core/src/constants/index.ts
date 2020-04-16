/**
 * 项目内常量,禁止重新赋值修改
 */

export const publicUrl = process.env.PUBLIC_PATH || '/'
export const routeLimitKey = '$page'
export const appRootId = 'app-root'
export const defaultEnvMode = 'localhost'
export const coreStatic = `${publicUrl}static/rtadmin/core`
export const strDelimiter = '@##@' // 防止可视字符被覆盖

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
  appLang: 'appLangMessage',
}

// 存储相关的 key
export const storage = {
  userInfo: 'userInfoStore',
  appTheme: 'appThemeStore',
  appLimit: 'appLimitStore',
  dev: {
    limit: 'devLimitStore',
    api: 'devApiStore',
  },
}
