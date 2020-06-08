/**
 * 用户模块
 * ---
 * 以下均为 demo 应用实现，具体请根据自己需求编写代码
 */

import { toast } from 'amis'

import { app } from '@core/app'
import { setAppLimits } from '@core/routes/limit/exports'
import { clearStore, getStore } from '@core/utils/store'

import { storeKeys } from '../constants'
import { userMock } from './mock'

let userInfo = {}
/**
 * 系统登录的鉴权方法，返回值 true 表示，用户可以正常访问， false 表示需要 重新登录。
 */
export async function onAuth() {
  // demo 项目用于统计的接口，可以自行删除
  app.request({
    url: 'POST ovapi/stat/data',
    data: { code: 100001 },
  })
  try {
    const source = await fetchUserInfo()
    const { code, data } = source
    if (code === 0) {
      userInfo = data || {}
      // 从用户信息中获取权限，并设置到应用中
      setAppLimits(data.limit)
      return true
    }
  } catch (_) {
    //
  }

  return false
}

export async function fetchUserInfo() {
  return app.request({
    url: 'GET ovapi/user/info',
    expired: 1,
    mockSource: userMock,
    mock: false,
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
    app.request({
      url: 'POST ovapi/user/logout',
    })
  }
}

export function isLogin() {
  return !!getStore(storeKeys.auth)
}
