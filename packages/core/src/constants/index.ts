/**
 * 项目内常量,禁止重新赋值修改
 */

import { isObject, isString, map } from 'lodash'

export const rootRoute = '/'
export const publicUrl = process.env.PUBLIC_PATH || '/'
export const parentKey = 'parent'
export const routeLimitKey = '$page'
export const appRootId = 'app-root'
export const defaultEnvMode = 'localhost'
export const coreStatic = `${publicUrl}static/ovine/core`
export const strDelimiter = '@##@'
export const defLoadPageSchema = { schema: { type: 'page', body: '当前页面加载错了...' } }

export const appKey = process.env.APP_KEY

// 屏幕尺寸定义
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

const getAppKey = (v: any) => {
  if (isString(v) && v.startsWith('lib')) {
    return `${appKey}_${v}`
  } 
    return v
  
}

const getAppKeys = (values: any) => {
  const keys: any = {}
  map(values, (v, k) => {
    if (isObject(v)) {
      keys[k] = getAppKeys(v)
    } else {
      keys[k] = getAppKey(v)
    }
  })
  return keys
}

const msgKeys = {
  storeRoot: '$store/',
  layoutSpinner: '$store/libLayoutSpinner',
  appTheme: 'libAppThemeMsg',
  appLocale: 'libAppLocaleMsg',
  clearRouteTabs: 'libClearRouteTabsMsg',
  routeTabChange: 'libRouteTabChangeMsg',
  asideLayoutCtrl: {
    msg: 'libAsideLayoutCtrlMsg',
    reload: 'libToggleAsideReloadMsg',
    toggleScreen: 'libToggleAsideScreenMsg',
    toggleFold: 'libToggleAsideFoldMsg',
  },
}

// 消息通知相关的 key
export const message = appKey ? (getAppKeys(msgKeys) as typeof msgKeys) : msgKeys

const storeKeys = {
  appInstance: 'libAppInsStore',
  userInfo: 'libUserInfoStore',
  appTheme: 'libAppThemeStore', // 注意此处修改 cli 的主题有用到 'libAppThemeStore' 字符串，修改的时候切记一起改，
  appLocale: 'libAppLocaleStore',
  appLimit: 'libAppLimitStore',
  routeTabs: 'libRouteTabsStore', // 存储 RouteTabs 数据
  routeQuery: 'libRouteQueryStore',
  supportRouteTabs: 'supportRouteTabsStore', // 是否支持 RouteTabs
  enableRouteTabs: 'libEnableRouteTabsStore', // 在支持的情况下， 是否开启使用 RouteTabs 功能
  routeData: 'libRouteDataStore',
  dev: {
    code: 'libDevCodeGlobal',
    limit: 'libDevLimitStore',
    api: 'libDevApiStore',
  },
}

// 存储相关的 key
export const storage = appKey ? (getAppKeys(storeKeys) as typeof storeKeys) : storeKeys
