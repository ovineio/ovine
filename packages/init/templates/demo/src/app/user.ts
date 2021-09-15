/**
 * 用户模块
 * ---
 * 以下均为 demo 应用实现，具体请根据自己需求编写代码
 */

import { toast } from 'amis'

import { app } from '@core/app'
import { routeLimitKey } from '@core/constants'
import { setAppLimits } from '@core/routes/limit/exports'
import { clearStore, getStore } from '@core/utils/store'

import { apis } from './common/apis'
import { storeKeys } from './constants'

let userInfo: any = {}

/**
 * 检查服务器的接口字符串。-----此处只是demo举例，其他逻辑可以自行添加
 * 权限相关文档：https://ovine.igroupes.com/org/docs/advance/limit
 * @param limitStr 从服务器接口获取的权限字符串
 * @returns 权限字符串是否通过校验
 */
function checkAppLimitStr(limitStr: string): boolean {
  /**
   * 权限字段检查，如果设置的权限有异常，不能正常登陆，并给予提示。权限异常条件
   * 1. limitStr 不存在
   * 2. limitStr 不是根权限标示符 并且 limitStr 中不存在 路由权限 （即没有一个展示路由时）。
   */
  if (
    !limitStr ||
    (limitStr !== app.constants.rootLimitFlag && limitStr.indexOf(routeLimitKey) === -1)
  ) {
    toast.error('当前用户权限异常', '系统提示')
    return false
  }

  // 将检查通过的权限字符串，设置到应用中
  setAppLimits(limitStr)

  return true
}

/**
 * 系统登录的鉴权方法。返回值 true: 用户通过登陆认证。 false：不通过登陆认证，需要重新登录。
 * ---
 * 此处只是demo举例，其他逻辑可以自行添加
 */
export async function onAuth() {
  // demo 项目用于统计的接口，可以自行删除
  app.request({
    ...apis.pageStat,
    data: { code: 100001 },
  })
  try {
    await fetchUserInfo()
    // 检查用户接口权限字符串
    return checkAppLimitStr(userInfo.limit)
  } catch (_) {
    //
  }
  return false
}

// 从接口获取用户信息
export async function fetchUserInfo() {
  return app.request(apis.getSelfInfo).then((source) => {
    userInfo = source.data.data
    return userInfo
  })
}

// 获取缓存的用户信息
export function getUserInfo(callback?: (info: any) => void) {
  if (callback) {
    fetchUserInfo().then(callback)
  }
  return userInfo
}

// 退出登录
export function logout(option?: { tip?: string; useApi?: boolean }) {
  const { tip = '您已经成功退出登录', useApi = false } = option || {}

  app.routerHistory.push('/login')
  toast.info(tip, '系统提示')
  clearStore(storeKeys.auth)

  if (useApi) {
    app.request(apis.selfLogout)
  }
}

// 判断用户是否是登陆状态
export function isLogin() {
  return !!getStore(storeKeys.auth)
}
