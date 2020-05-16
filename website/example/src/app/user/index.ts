import { toast } from 'amis'

import { app } from '@core/app'
import { setAppLimits } from '@core/routes/limit/exports'
import { clearStore, getStore } from '@core/utils/store'

import { storeKeys } from '../constants'
import { userMock } from './mock'

let userInfo = {}

export async function onAuth() {
  app.request({
    url: 'POST rtapi/stat/data',
    data: { code: 100001 },
  })
  try {
    const source = await fetchUserInfo()
    const { code, data } = source
    if (code === 0) {
      userInfo = data || {}
      setAppLimits(data.limit)
      return true
    }
  } catch (_) {
    //
  }

  return false
}

export async function fetchUserInfo() {
  return app.request<any>({
    url: 'GET rtapi/user/info',
    expired: 1,
    mockSource: userMock,
    mock: false,
  })
}

export function getUserInfo(callback?: (info: any) => void) {
  if (callback) {
    fetchUserInfo().then(callback)
  }
  return userInfo
}

export function logout(option?: { tip?: string; useApi?: boolean }) {
  const { tip = '您已经成功退出登录', useApi = false } = option || {}

  app.routerHistory.push('/login')
  toast.info(tip, '系统提示')
  clearStore(storeKeys.auth)

  if (useApi) {
    app.request({
      url: 'POST rtapi/user/logout',
    })
  }
}

export function isLogin() {
  return !!getStore(storeKeys.auth)
}
