/**
 * 用户模块
 */

import { userInfo } from '~/constants/store_key'
import { mockSource } from '~/pages/login/mock'
import { setAppLimits } from '~/routes/limit_util'
import { clearStore, getStore, setStore } from '~/utils/store'
import { queryStringParse } from '~/utils/tool'

import request, { ReqSucHook } from './request'

let store: any = getStore(userInfo) || {}

// 用户token
export const getToken = (): string | undefined => {
  return store?.access_token || queryStringParse('access_token')
}

// 是否登录
export const isLogin = (): boolean => {
  return !!getToken()
}

// 检验 token 出错后的操作
export const onUserTokenError = () => {
  //
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

// 用户登录
export const userLoginHook: ReqSucHook<App.UserInfoData> = (source) => {
  cacheUserInfo(source)
  setStore('test_limit', source.data?.limit)
  return source
}

export const initUser = () => {
  return getUserInfo()
}

/**
 * TODO: 梳理用户模块
 *  1. login 登录接口
 *    登录 app, 并缓存token，用户信息
 *  2. logout 登出接口
 *    清除用户相关的缓存内容
 *  3. info 获取信息接口
 *    每次刷新页面，获取用户信息，更新缓存信息，如果token过期，重新登录
 *  4. update 更新接口
 *    更新用户信息，密码等
 *  5. request模块 加入 token 认证，钩子函数
 *  6. token 错误回调
 *     统一退出APP
 */
