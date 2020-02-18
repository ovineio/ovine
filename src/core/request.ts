/**
 * 应用内请求模块
 */

import { qsstringify } from 'amis/lib/utils/helper'
import { filter } from 'amis/lib/utils/tpl'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'

import config, { UrlMode } from '~/config'
import { userTokenError } from '~/constants'
import logger from '~/utils/logger'
import { getSessionStore, setSessionStore } from '~/utils/store'
import { isExpired, queryStringParse } from '~/utils/tool'

import { getToken, onUserTokenError } from './user'

// 服务端接口 格式
export type ServerApiRes<T> = T & {
  code?: number
  data?: T
  msg?: string
  message?: string
  error?: any
}

// 请求方法
export type RequestMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD'

type UseCommErrHandle = boolean | void

export type MockSourceGen<S = {}, P = {}> =
  | ((options: UnionOption<S, P>) => object)
  | ServerApiRes<S>

export type ReqSucHook<S = {}, P = {}> = (
  source: ServerApiRes<S>,
  unionOption: UnionOption<S, P>
) => any

export type ReqErrorHook<S = {}, P = {}> = (option: {
  source?: ServerApiRes<S>
  requestOption?: UnionOption<S, P>
  error?: any
}) => UseCommErrHandle

export type MockSource<S = {}, P = {}> = Types.ObjectOf<MockSourceGen<S, P>>

export type RequestOption<S = {}, P = {}> = {
  url: string // required
  api?: string // 默认与 url 一样
  method?: RequestMethod // get
  urlMode?: UrlMode // 'api'
  data?: Partial<P> // {}
  body?: any
  useCommErrHandle?: UseCommErrHandle // true
  token?: 'none' | 'auto' | 'force' // auto
  sourceKey?: string // ''
  expired?: number // 秒数 0
  fetchOption?: RequestInit
  mock?: boolean // 是否启用 mock
  mockSource?: MockSourceGen // 数据生成器
  mockTimeout?: number // 300
  onSuccess?: ReqSucHook<S, P> // 接口成功回调
  onError?: ReqErrorHook<S, P> // 接口失败回调
}

export type FetchOption = Omit<RequestInit, 'method'> & {
  url: string
  method: RequestMethod
  headers?: any
  body?: any
}

type UnionOption<S = {}, P = {}> = RequestOption<S, P> & FetchOption

const log = logger.getLogger('dev:request')

// 请求错误集中处理， 必须 throw 错误
const requestErrorCtrl = (
  type: 'fetch' | 'status' | 'token',
  option: UnionOption | RequestOption,
  source?: any
) => {
  const { onError: handle = false, useCommErrHandle = true } = option

  const errors = {
    fetch: source,
    status: new Error('status <= 100 || status >= 400'),
    token: new Error(userTokenError),
  }
  const resSource = type === 'status' ? source : {}
  const errorInfo: any = {
    source: resSource,
    error: errors[type],
    option,
  }

  // 不执行公共错误处理
  if ((handle && handle(errorInfo) === false) || !useCommErrHandle) {
    throw errorInfo
  }

  // 公共错误处理逻辑部分

  if (type === 'token') {
    // token 无效
    onUserTokenError()
  }

  if (resSource.code !== 0) {
    // 业务逻辑报错
    log.log('resSource.code !== 0', resSource)
  }

  log.info('requestErrorCtrl', errorInfo)
  throw errorInfo
}

// 用户 TOKEN 配置
// 根据 与 api 约定，处理 用户 token
const userTokenCtrl = (option: RequestOption): RequestOption => {
  const { data, token = 'auto' } = option
  const userToken = getToken()

  // 不需要 token 的情况
  if (token === 'none' || (!userToken && token === 'auto')) {
    return option
  }

  // 明确需要 token 但是 token不存在
  if (token === 'force' && !userToken) {
    requestErrorCtrl('token', option)
  }

  // url 声明需要 token 但，该请求并不一定要 token
  if (userToken) {
    option.data = {
      ...data,
      access_token: userToken,
    }
  }

  return option
}

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 模拟数据
const mockSourceCtrl = async (option: UnionOption) => {
  const { mockSource, onSuccess, sourceKey = '', api, url, mock = true, mockTimeout = 300 } = option
  // 预览打包，暂时去掉 config.isProd 限制

  // config.isProd || !mockSource
  if (!mock || !mockSource) {
    return 'none'
  }

  const apiStr = api || url

  // mock数据生成方式
  const mockSourceGen = get(mockSource, apiStr) ? (mockSource as any)[apiStr] : mockSource

  // mock 原始数据
  const source: any = typeof mockSourceGen === 'function' ? mockSourceGen(option) : mockSourceGen

  const data = !sourceKey ? source : get(source, sourceKey)

  // mock 最终返回结果
  const result = !onSuccess ? data : await onSuccess(data, option)

  if (mockTimeout) {
    await timeout(mockTimeout)
  }

  log.log('mockSource', option.url, result, option)

  return result
}

// 只缓存 GET 请求
const cacheSourceCtrl = (type: 'set' | 'get', option: UnionOption, resource?: any) => {
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
    return
  }
}

// 发出请求
const fetchSourceCtrl = async (option: UnionOption) => {
  const { url, method } = option

  const resData = await fetch(url, option)
    .catch((error) => {
      requestErrorCtrl('fetch', option, error)
    })
    .then((source: any) => {
      // 当 fetch 发生错误时 不做任何处理
      if (!source) {
        return
      }

      const status = Number(source.status)

      if (status <= 100 || status >= 400) {
        requestErrorCtrl('status', option, source)
      }

      if (method === 'DELETE' || status === 204) {
        return source.text()
      }

      return source.json()
    })

  return resData
}

// 获取 fetch 参数
const getFetchOption = (option: RequestOption): FetchOption => {
  const { data = {}, body, fetchOption: fetchOpt = {} } = option

  const { url, method } = getUrlByOption(option) as any
  const hasBody = !/GET|HEAD/.test(method)

  const headers = {
    Accept: 'application/json',
  }

  const fetchOption: FetchOption = {
    ...fetchOpt,
    url,
    method,
    headers: {
      ...fetchOpt.headers,
      ...headers,
    },
  }

  if (!body && fetchOption.headers) {
    fetchOption.headers['Content-Type'] = 'application/json; charset=utf-8'
  }

  if (hasBody) {
    fetchOption.body = body ? body : JSON.stringify(data)
  }

  return fetchOption
}

// 可中断的 request 请求
export function abortRequest<S = {}, P = {}>(option: RequestOption<S, P>) {
  const { abort, signal } = new AbortController()

  if (option.fetchOption) {
    option.fetchOption.signal = signal
  } else {
    option.fetchOption = {
      signal,
    }
  }

  return {
    abort,
    request: async () => request(option),
  }
}

async function request<S, P>(option: RequestOption<S, P>): Promise<ServerApiRes<S> | undefined>
async function request(option: RequestOption<any, any>): Promise<any | undefined> {
  const { onSuccess, sourceKey, data: params, url, api } = option
  option.api = api || url

  const query: any = queryStringParse('', url)
  if (query) {
    option.url = url.split('?')[0]
    option.data = { ...query, ...params }
  }

  const fetchOptions = getFetchOption(userTokenCtrl(option))
  const unionOption = { ...option, ...fetchOptions }

  // 命中缓存 直接返回
  const cachedResponse = cacheSourceCtrl('get', unionOption)
  if (cachedResponse) {
    return cachedResponse
  }

  // mock数据拦截
  const mockSource = await mockSourceCtrl(unionOption)
  if (mockSource !== 'none') {
    cacheSourceCtrl('set', unionOption, mockSource)
    return mockSource
  }

  const resData = await fetchSourceCtrl(unionOption)

  const data = !sourceKey ? resData : get(resData, sourceKey)

  cacheSourceCtrl('set', unionOption, data)

  const result = !onSuccess ? data : await onSuccess(data, unionOption)

  log.log('apiSource', unionOption.url, result, unionOption)

  return result
}

export const getUrlByOption = (option: RequestOption) => {
  const { url, data = {}, method = 'GET', urlMode: urlModule = 'api' } = option

  let realUrl = url

  const urlOption = { url, method: method.toUpperCase() }
  const params = omitBy(data as any, (item) => item === undefined || item === null)

  if (/[GET|POST|PUT|DELETE|PATCH|HEAD] /.test(realUrl)) {
    urlOption.method = `${(/^.*? /.exec(url) || [])[0]}`.replace(' ', '') as RequestMethod
    realUrl = realUrl.replace(/^.*? /, '')
  }

  // url中不存在 '//' 匹配
  if (!/\/\//.test(realUrl)) {
    const urlPrefix = config.urlMode[urlModule]
    if (!urlPrefix) {
      log.error('request.getUrlByOption 解析出错', option)
    }
    realUrl = `${urlPrefix}/${realUrl}`
  }

  // 存在模版标记 tag
  if (/\{/.test(realUrl)) {
    realUrl = filter(realUrl, data)
  }

  if (urlOption.method === 'GET' && !isEmpty(data)) {
    const queryParams = omitBy(params, (item) => item === 'undefined' || item === '')
    realUrl += `${realUrl.indexOf('?') === -1 ? '?' : '&'}${qsstringify(queryParams)}`
  }

  urlOption.url = realUrl

  return urlOption
}

export default request
