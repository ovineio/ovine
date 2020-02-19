/**
 * 用户模块
 */

import { setStore } from '~/utils/store'

import { cacheUserInfo, getToken, getUserInfo, onUserTokenError } from './export'

export const initUser = () => {
  return getUserInfo()
}

// 用户登录
export const userLoginHook: Req.SuccessHook<App.UserInfoData> = (source) => {
  cacheUserInfo(source)
  setStore('test_limit', source.data?.limit)
  return source
}

export const userTokenCtrl = (option: Req.Option) => {
  const { token = 'auto', headers } = option
  const userToken = getToken()

  // 不需要 token 的情况
  if (token === 'none' || (!userToken && token === 'auto')) {
    return option
  }

  // 明确需要 token 但是 token不存在
  if (token === 'force' && !userToken) {
    onUserTokenError()
  }

  // url 声明需要 token 但，该请求并不一定要 token
  if (userToken) {
    option.headers = {
      ...headers,
      ['X-AUTH']: userToken,
    }
  }

  return option
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
