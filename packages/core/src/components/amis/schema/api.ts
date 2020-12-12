import { Api, Payload } from 'amis/lib/types'
import { qsstringify } from 'amis/lib/utils/helper'
import { dataMapping, tokenize } from 'amis/lib/utils/tpl-builtin'
import { cloneDeep, isEmpty, isPlainObject } from 'lodash'
import { parse } from 'qs'

import { app } from '@/app'
import logger from '@/utils/logger'
import { normalizeUrl } from '@/utils/request'

const log = logger.getLogger('lib:amis:api')

/**
 * amis 请求返回值格式
 * @param res 请求返回值
 */
function responseAdaptor(res: any) {
  const { data } = res

  if (!data) {
    throw new Error('Response is empty!')
  } else if (typeof data.status === 'undefined') {
    // 兼容不返回 status 字段的情况
    data.status = 0
  }

  const payload: Payload = {
    ok: data.status === 0,
    status: data.status,
    msg: data.msg,
    msgTimeout: data.msgTimeout,
    data: !data.data && typeof data.status === 'undefined' ? data : data.data, // 兼容直接返回数据的情况
  }

  return payload
}

// 字符串转 Function
function str2function(name: string, content: string, ...args: Array<string>): Function | null {
  try {
    // eslint-disable-next-line
    const func = new Function(...args, content)
    return func
  } catch (error) {
    log.warn(`Request模块 ${name} 转 Function 错误`, error)
    return null
  }
}

/**
 * 重写 amis api 请求模块，并兼容 amis 参数
 */
export const libFetcher = (
  api: Api,
  data: any, // 数据
  option: {
    autoAppend?: boolean
    ignoreData?: boolean
    [propName: string]: any
  } = {}
): any => {
  const amisApi: any =
    typeof api === 'string'
      ? {
          url: api,
        }
      : isPlainObject(api)
      ? { ...api }
      : {}

  // 提示与 amis 不兼容的地方
  if (!amisApi.url || typeof amisApi.url !== 'string') {
    throw new Error('请求模块一定要传 url 字符串格式参数')
  }

  // 去除末尾多余的 ? 号
  amisApi.url = amisApi.url.replace(/\?{1,}$/, '')

  // 添加参数
  amisApi.api = amisApi.api || amisApi.url
  amisApi.config = option
  amisApi.isEnvFetcher = true
  const {
    requestAdaptor,
    adaptor,
    onPreRequest,
    onRequest,
    onFakeRequest,
    onSuccess,
    onError,
  } = amisApi

  if (requestAdaptor || adaptor) {
    log.warn(
      '不兼容 requestAdaptor,adaptor 参数，请使用 onPreRequest, onSuccess 代替。文档地址：https://ovine.igroupes.com/org/docs/modules/request'
    )
  }

  // 检测是回调字符串 转 Function
  if (onFakeRequest && typeof onFakeRequest === 'string') {
    amisApi.onFakeRequest = str2function('onFakeRequest', onFakeRequest, 'option')
  }
  if (onPreRequest && typeof onPreRequest === 'string') {
    amisApi.onPreRequest = str2function('onPreRequest', onPreRequest, 'option')
  }
  if (onRequest && typeof onRequest === 'string') {
    amisApi.onRequest = str2function('onRequest', onRequest, 'option')
  }
  if (onSuccess && typeof onSuccess === 'string') {
    amisApi.onSuccess = str2function('onSuccess', onSuccess, 'source', 'option', 'response')
  }
  if (onError && typeof onError === 'string') {
    amisApi.onError = str2function('onError', onError, 'response', 'option', 'error')
  }

  const { method, url } = normalizeUrl(amisApi.url, amisApi.method || amisApi.config.method)
  amisApi.method = method
  amisApi.mappingData = cloneDeep(amisApi.data || {}) // 用于映射的参数
  amisApi.rawData = {}

  // 特殊情况 不作处理
  if (!data || data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
    amisApi.data = data || {}
  } else {
    const { autoAppend, ignoreData } = option
    const idx = url.indexOf('?')
    const hashIdx = url.indexOf('#')
    const hasString = hashIdx !== -1 ? url.substring(hashIdx) : ''

    // 请求原始参数
    amisApi.rawData = cloneDeep(isEmpty(data) ? data.__super || {} : data)

    // BUG: 表单传入 默认 value:xxx将影响， request 时的 传入 data
    const urlMappingData = isEmpty(data) && !data.__super ? amisApi.data || {} : data

    // 与 amis 默认逻辑保持一致
    if (idx === -1) {
      amisApi.url = tokenize(url, urlMappingData, '| url_encode')
    } else {
      const urlParams = parse(url.substring(idx + 1, hashIdx !== -1 ? hashIdx : undefined))
      amisApi.url =
        tokenize(url.substring(0, idx + 1), urlMappingData, '| url_encode') +
        qsstringify(dataMapping(urlParams, urlMappingData), amisApi.qsOptions) +
        hasString
    }

    if (!ignoreData) {
      if (amisApi.data) {
        amisApi.data = dataMapping(amisApi.data, data)
      } else if (/POST|PUT/.test(method) || (/GET/.test(method) && autoAppend)) {
        amisApi.data = cloneDeep(data)
      }
    }
  }

  return app.request(amisApi).then(responseAdaptor)
}
