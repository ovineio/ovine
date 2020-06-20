/**
 * 项目内常量,禁止重新赋值修改
 */

export const publicUrl = process.env.PUBLIC_PATH || '/'
export const routeLimitKey = '$page'
export const appRootId = 'app-root'
export const defaultEnvMode = 'localhost'
export const coreStatic = `${publicUrl}static/ovine/core`
export const strDelimiter = '@##@'

// 屏幕尺寸定义
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

// core 需要用的一些关键字均使用 libXXX 开头，防止与开发者业务冲突

// 消息通知相关的 key
export const message = {
  storeRoot: '$store/',
  layoutSpinner: '$store/libLayoutSpinner',
  appTheme: 'libAppThemeMsg',
  appLang: 'libAppLangMsg',
  updateRouteStore: 'libUpdateRouteStoreMsg',
}

// 存储相关的 key
export const storage = {
  appInstance: 'libAppInsStore',
  userInfo: 'libUserInfoStore',
  // 注意此处修改 cli 的主题有用到 libAppThemeStore 字符串，修改的时候切记一起改，
  appTheme: 'libAppThemeStore',
  appLimit: 'libAppLimitStore',
  dev: {
    code: 'libDevCodeGlobal',
    limit: 'libDevLimitStore',
    api: 'libDevApiStore',
  },
}
