/**
 * 用户模块
 * ---
 * 以下均为 demo 应用实现，具体请根据自己需求编写代码
 */

import { toast } from 'amis'

import { app } from '@core/app'
import { setAppLimits } from '@core/routes/limit/exports'
import { clearStore, getStore } from '@core/utils/store'

import { apis } from './common/apis'
import { storeKeys } from './constants'

let userInfo = {}

/**
 * 系统登录的鉴权方法，返回值 true 表示，用户可以正常访问， false 表示需要 重新登录。
 */
export async function onAuth() {
  // demo 项目用于统计的接口，可以自行删除
  app.request({
    url: apis.pageStat.url,
    data: { code: 100001 },
  })
  try {
    await fetchUserInfo()
    // 从用户信息中获取权限，并设置到应用中
    if (userInfo.limit) {
      setAppLimits(userInfo.limit)
      return true
    }
  } catch (_) {
    //
  }
  return false
}

export async function fetchUserInfo() {
  return app.request(apis.getSelfInfo).then((source) => {
    userInfo = source.data.data
    return userInfo
  })
}

export function getUserInfo(callback) {
  if (callback) {
    fetchUserInfo().then(callback)
  }
  return userInfo
}

export function logout(option) {
  const { tip = '您已经成功退出登录', useApi = false } = option || {}

  app.routerHistory.push('/login')
  toast.info(tip, '系统提示')
  clearStore(storeKeys.auth)

  if (useApi) {
    app.request(apis.selfLogout)
  }
}

export function isLogin() {
  return !!getStore(storeKeys.auth)
}
