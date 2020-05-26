/**
 * 封装 fetch 请求
 */

/* eslint-disable consistent-return */
import { qsstringify } from 'amis/lib/utils/helper' // eslint-disable-line
import { filter } from 'amis/lib/utils/tpl'
import { get, isEmpty, omitBy } from 'lodash'
import { fetch } from 'whatwg-fetch'

import logger from '@/utils/logger'
import { getSessionStore, setSessionStore } from '@/utils/store'
import { isExpired, getQuery, timeout } from '@/utils/tool'

import { MixObject } from '../types'
import * as Types from './types'

const log = logger.getLogger('lib:utils:request')

// 请求错误集中处理， 必须 throw 错误
function requestErrorCtrl(this: Request, option: Types.ReqUnionOption, response: any, error: any) {
  const { onError } = option

  log.info('requestErrorCtrl', { response, error })

  const errorSource = { option, response, error }

  let withInsErrorHook

  if (onError) {
    withInsErrorHook = onError(errorSource)
  }

  if (withInsErrorHook !== false && this.onError) {
    this.onError(errorSource)
  }

  if (this.onFinish) {
    this.onFinish(errorSource)
  }

  throw errorSource
}

// 模拟数据
async function mockSourceCtrl(this: Request, option: Types.ReqUnionOption) {
  const { mockSource, onSuccess, sourceKey = '', api, url, mock = true, mockTimeout = 300 } = option

  if (this.isRelease || !mock || !mockSource) {
    return 'none'
  }

  const apiStr = api || url

  // mock数据生成方式
  const mockSourceGen = get(mockSource, apiStr) ? (mockSource as any)[apiStr] : mockSource

  // mock 原始数据
  let origin: any = typeof mockSourceGen === 'function' ? mockSourceGen(option) : mockSourceGen
  const mockResponse: any = typeof Response !== 'undefined' ? new Response() : {}

  if (this.onSuccess) {
    origin = this.onSuccess({ option, response: mockResponse, source: origin })
  }

  const source = !sourceKey ? origin : get(origin, sourceKey)

  // mock 最终返回结果
  const data = !onSuccess ? source : await onSuccess(source, option)

  if (this.onFinish) {
    this.onFinish({ option, response: mockResponse, source: data })
  }

  if (mockTimeout) {
    await timeout(mockTimeout)
  }

  log.log('mockSource', option.url, data, option)

  return data
}

// 只缓存 GET 请求
const cacheSourceCtrl = (type: 'set' | 'get', option: Types.ReqUnionOption, resource?: any) => {
  const { url = '', expired = 0, method = 'GET' } = option || {}

  if (!expired || method !== 'GET') {
    return
  }

  const timestampKey: any = `${url}:timestamp`

  if (type === 'set') {
    // 不存在 resource 直接返回
    if (!resource) {
      return
    }
    // 所有数据按照 字符串缓存
    setSessionStore(url, resource)
    setSessionStore(timestampKey, (Date.now() + expired * 1000).toString())
    return
  }

  if (type === 'get') {
    const cached = getSessionStore(url)
    const whenExpired = getSessionStore<string>(timestampKey)

    if (cached && whenExpired) {
      if (!isExpired(whenExpired)) {
        log.log('cacheSource', option.url, cached, option)
        return cached
      }
    }
  }
}

// 发出请求
async function fetchSourceCtrl(this: Request, option: Types.ReqUnionOption) {
  const { url, sourceKey, onRequest, onSuccess } = option

  let reqOption = !this.onRequest ? option : this.onRequest(option)
  reqOption = !onRequest ? reqOption : onRequest(reqOption)

  const result = await fetch(url, reqOption)
    .catch((error: any) => {
      requestErrorCtrl.call(this, option, {}, error)
    })
    .then(async (response: any) => {
      // 当 fetch 发生错误时 不做任何处理
      if (!response) {
        return
      }

      const status = Number(response.status)

      if (status <= 100 || status >= 400) {
        requestErrorCtrl.call(this, option, response, new Error('status <= 100 || status >= 400'))
        return
      }

      try {
        let origin = await response.json()

        if (this.onSuccess) {
          origin = this.onSuccess({ option, response, source: origin })
        }

        const source = !sourceKey ? origin : get(origin, sourceKey)
        const data = !onSuccess ? source : await onSuccess(source, option)

        if (this.onFinish) {
          this.onFinish({ option, response, source })
        }

        return data
      } catch (error) {
        requestErrorCtrl.call(this, option, response, error)
      }
    })

  return result
}

// 获取 fetch 参数
function getFetchOption(this: Request, option: Types.ReqOption): Types.ReqFetchOption {
  const { data = {}, json = true, body, headers = {}, fetchOption: fetchOpt = {} } = option

  const { url, method } = getUrlByOption.call(this, option) as any
  const hasBody = !/GET|HEAD/.test(method)

  const fetchOption: Types.ReqFetchOption = {
    ...fetchOpt,
    url,
    method,
    headers,
    credentials: 'include',
  }

  if (json && !fetchOption.headers.Accept) {
    fetchOption.headers.Accept = 'application/json'
  }

  if (json && !body && !fetchOption.headers['Content-Type']) {
    fetchOption.headers['Content-Type'] = 'application/json;charset=utf-8'
  }

  if (data instanceof FormData && !body) {
    fetchOption.body = data
  } else if (hasBody) {
    fetchOption.body = body || JSON.stringify(data)
  }

  return fetchOption
}

export function getUrlByOption(
  this: Types.ReqConfig,
  option: Types.ReqOption & Partial<Types.ReqConfig>
) {
  const { url = '', data = {}, method = 'GET', domain = 'api', qsOptions, domains } = option

  let realUrl = url

  const urlOption = { url, method: method.toUpperCase() }

  if (/[GET|POST|PUT|DELETE|PATCH|HEAD] /.test(realUrl)) {
    urlOption.method = `${(/^.*? /.exec(url) || [])[0]}`.replace(' ', '') as Types.ReqMethod
    realUrl = realUrl.replace(/^.*? /, '')
  }

  const apiDomains = domains || this.domains || {}

  // url中不存在 '//' 匹配
  if (!/\/\//.test(realUrl)) {
    const urlPrefix = apiDomains[domain]
    if (!urlPrefix) {
      log.error('request.getUrlByOption 解析出错', option)
    }
    realUrl = `${urlPrefix}/${realUrl}`
  }

  // 存在模版标记 tag
  if (/\$/.test(realUrl)) {
    realUrl = filter(realUrl, data)
  }

  if (urlOption.method === 'GET' && !isEmpty(data)) {
    // 过滤无效重复 查询参数
    const queryParams = omitBy(data, (item, key) => {
      const isNull = item === undefined || item === null || item === 'undefined' || item === ''
      const queryStr = realUrl.split('?')[1] || ''
      if (isNull || queryStr.indexOf(`${key}=`) > -1) {
        return true
      }
    })

    realUrl += `${realUrl.indexOf('?') === -1 ? '?' : '&'}${qsstringify(queryParams, {
      encode: false, // 防止多次 encode
      ...qsOptions,
    })}`
  }

  urlOption.url = realUrl

  return urlOption
}

// 使用 class 能够更容易重写 request 的一些回调值
export class Request<T = {}, K = {}> {
  constructor(config?: Types.ReqConfig) {
    this.setConfig(config)
  }

  // 配置的域名
  public domains: { [domain: string]: string } = {}

  // 是否是 发版环境
  public isRelease?: boolean

  // 请求预处理阶段
  public onPreRequest?: (option: Types.ReqOption) => Types.ReqOption

  // 发送请求前
  public onRequest?: (option: Types.ReqUnionOption) => Types.ReqUnionOption

  // 错误回调
  public onError?: (option: {
    option: Types.ReqUnionOption
    response: Response
    error?: any
  }) => any

  // 请求成功回调
  public onSuccess?: (option: {
    option: Types.ReqUnionOption
    response: Response
    source?: any
  }) => any

  // 请求结束回调
  public onFinish?: (option: {
    option: Types.ReqUnionOption
    response: Response
    error?: any
    source?: any
  }) => void

  public setConfig(config?: Types.ReqConfig) {
    const { domains = {}, isRelease } = config || {}
    this.domains = domains
    this.isRelease = isRelease
  }

  public getUrlByOption(option: MixObject<Types.ReqOption<K>, T>) {
    return getUrlByOption.call(this, option as any)
  }

  public async request<S = {}, P = {}>(
    option: MixObject<Types.ReqOption<MixObject<S, K>, P>, T>
  ): Promise<Types.ReqServerApiRes<MixObject<S, K>> | undefined>

  // eslint-disable-next-line
  public async request(option: any): Promise<any> {
    const { data: params, url = '', actionAddr, api, onPreRequest } = option
    let parsedOption = option

    parsedOption.api = api || url
    parsedOption.actionAddr = actionAddr || parsedOption.api

    if (!option.api) {
      log.error('request option.api 不存在', option)
      return
    }

    const query: any = url && getQuery('', url)

    if (query) {
      if (url) {
        parsedOption.url = url.split('?')[0] // eslint-disable-line
      }
      parsedOption.data = { ...query, ...params }
    }

    if (this.onPreRequest) {
      parsedOption = this.onPreRequest(parsedOption)
    }

    if (onPreRequest) {
      parsedOption = onPreRequest(parsedOption)
    }

    const unionOption = { ...parsedOption, ...getFetchOption.call(this, parsedOption) }

    // 命中缓存 直接返回
    const cachedResponse = cacheSourceCtrl('get', unionOption)
    if (cachedResponse) {
      return cachedResponse
    }

    // mock数据拦截
    const mockSource = await mockSourceCtrl.call(this, unionOption)
    if (mockSource !== 'none') {
      cacheSourceCtrl('set', unionOption, mockSource)
      return mockSource
    }

    const result = await fetchSourceCtrl.call(this, unionOption)

    cacheSourceCtrl('set', unionOption, result)

    log.log('[apiSource]', unionOption.url, result, unionOption)

    return result
  }
}
