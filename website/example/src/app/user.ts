import { toast } from 'amis'

import { app } from '@rtadmin/core/lib/app'
import { storage } from '@rtadmin/core/lib/constants'
import { routerHistory } from '@rtadmin/core/lib/routes/exports'
import { setAppLimits } from '@rtadmin/core/lib/routes/limit/exports'
import { clearStore, getStore } from '@rtadmin/core/lib/utils/store'

import { mockSource as loginMock } from '~/pages/login/mock'

import { storeKeys } from './constants'

let userInfo = {}

export async function onAuth() {
  try {
    const source = await fetchUserInfo()
    const { code, data } = source
    if (code === 0) {
      userInfo = data || {}
      setAppLimits(data.limit || getStore(storage.dev.limit))
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
    mockSource: loginMock,
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

  const onFinish = (source = {}) => {
    toast.info(tip, '系统提示')
    clearStore(storeKeys.auth)
    routerHistory.push('/login')
    return source
  }

  if (!useApi) {
    onFinish()
    return
  }

  app.request({
    url: 'POST rtapi/user/logout',
    onSuccess: onFinish,
    onError: onFinish,
  })
}

export function isLogin() {
  return !!getStore(storeKeys.auth)
}
