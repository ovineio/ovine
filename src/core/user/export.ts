/**
 * 用户模块
 */

import { userInfo } from '~/constants/store_key'
import { request } from '~/core/request'
import { mockSource } from '~/pages/login/mock'
import { setAppLimits } from '~/routes/limit/export'
import { clearStore, getStore, setStore } from '~/utils/store'
import { queryStringParse } from '~/utils/tool'

let store: any = getStore(userInfo) || {}

// 用户token
export const getToken = (): string | undefined => {
  return store?.access_token || queryStringParse('access_token')
}

export const onUserTokenError = () => {
  //
}

// 是否登录
export const isLogin = (): boolean => {
  return !!getToken()
}

// 用户登出
export const userLogout = () => {
  clearStore(userInfo)
  location.href = '/login'
}

export const getUserInfo = () => {
  return request<App.UserInfoData, {}>({
    url: 'GET api/v1/user_info',
    mockSource,
    onSuccess: (source) => {
      const { access_token, ...data } = source?.data || {}
      cacheUserInfo({ data, isUserInfo: true })
      return source
    },
  })
}

export const cacheUserInfo = (source: any) => {
  const { limit = '', isUserInfo, ...rest } = source?.data || {}
  const cachedInfo = getStore<App.UserInfoData>(userInfo)
  if (source?.isUserInfo) {
    rest.access_token = cachedInfo?.access_token
  }
  store = rest
  setAppLimits(limit)
  setStore(userInfo, rest)
}
