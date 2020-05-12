import { isPlainObject } from 'lodash'

import logger from '@core/utils/logger'
import { Request } from '@core/utils/request'
import { getStore } from '@core/utils/store'

import { storeKeys } from './constants'
import { logout } from './user'

const log = logger.getLogger('app:request')

export const request = new Request()

// 请求准备阶段 回调
request.onPreRequest = (option) => {
  option.mock = true // 全局控制是否开启 mock
  return option
}

// 请求发送前 回调
request.onRequest = (option) => {
  try {
    const { key, token } = getStore(storeKeys.auth) || {}
    const { actionAddr } = option

    option.credentials = 'include'

    // token 鉴权
    if (key) {
      option.headers[key] = token
    }

    // 操作地址
    if (actionAddr) {
      option.headers['X-ACTION-ADDR'] = actionAddr
    }
  } catch (error) {
    log.error('onRequest', error)
  }
  return option
}

// 接收到请求正常结果 回调
request.onSuccess = ({ source = {}, option }) => {
  const { code, data = {} } = source
  const { api } = option

  // 退出接口，不处理
  if (api !== 'POST rtapi/user/logout') {
    if (code === 10023 || code === 10022) {
      logout({
        tip: '当前用户登录过期，请重新登录',
      })
    }
  }

  // 列表接口适配
  if (isPlainObject(data) && data.list) {
    const { list, count, ...rest } = data
    source.data = {
      ...rest,
      total: count || 0,
      items: list,
    }
  }

  return source
}

// 请求发送错误错误 回调
request.onError = (option) => {
  const { error, ...reset } = option
  log.warn('请求发送出现错误', { option: reset }, error)
}
