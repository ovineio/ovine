/**
 * 应用内请求模块
 * ---
 * 以下 ovine demo api 一种实现方式，具体请根据项目进行修改
 * 请求模块: https://ovine.igroupes.com/org/docs/modules/request
 */

import { get } from 'lodash'

import logger from '@core/utils/logger'
import { Request } from '@core/utils/request'
import { getStore } from '@core/utils/store'

import { apis } from './common/apis'
import { storeKeys } from './constants'
import { logout } from './user'

// 日志模块 https://ovine.igroupes.com/org/docs/modules/logger
const log = logger.getLogger('app:request')

export const request = new Request()

// 请求准备阶段 回调
request.onPreRequest = (option) => {
  option.mock = true // 全局控制是否开启 mock， 必须在 ovine cli --mock 选项开启的情况下，才有效
  return option
}

// 请求发送前 回调
request.onRequest = (option) => {
  const { key, token } = getStore(storeKeys.auth) || {}
  const { actionAddr } = option

  // 开启携带 cookies 信息
  option.fetchOptions.credentials = 'include'

  // demo api 携带用户鉴权信息，具体鉴权需自行实现
  if (key) {
    option.headers[key] = token
  }

  // 操作地址
  if (actionAddr) {
    option.headers['X-ACTION-ADDR'] = actionAddr
  }

  return option
}

// 接收到请求正常结果 回调
request.onSuccess = (source, option) => {
  const { code = 0, msg, message } = source
  const { api } = option

  // 退出接口，不处理
  if (api !== apis.selfLogout.url) {
    // token 异常 code 处理
    if (code === 10023 || code === 10022) {
      logout({
        tip: '当前用户登录过期，请重新登录',
      })
    }
  }

  // demo api 对  amis 整体接口适配
  const apiSource = {
    ...source,
    status: code,
    msg: msg || message,
  }

  // demo api 对 amis curd 接口适配
  if (get(apiSource, 'data.list')) {
    const { list, count, ...restList } = apiSource.data
    apiSource.data = {
      ...restList,
      total: count || 0,
      items: list,
    }
  }

  return apiSource
}

// 请求发送错误错误 回调
request.onError = (response, option, error) => {
  log.warn('请求发送出现错误', { response, option }, error)
}
