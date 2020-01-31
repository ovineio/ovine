/**
 * 请求模块
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
import { isExpired } from '~/utils/tool'

import { getToken, onUserTokenError } from './user'

// 服务端接口 格式
export type ServerApiRes<T> = {
  code?: number
  data?: T
  msg?: string
  message?: string
  error?: any
}

// 请求方法
export type RequestMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD'

type UseCommErrHandle = boolean | void

export type RequestOption<S = {}, P = {}> = {
  api: string // required
  method?: RequestMethod // get
  urlMode?: UrlMode // 'api'
  params?: Partial<P> // {}
  body?: any
  useCommErrHandle?: UseCommErrHandle // true
  token?: 'none' | 'auto' | 'force' // auto
  sourceKey?: string // ''
  expired?: number // 秒数 0
  fetchOption?: RequestInit
  mockSource?: ServerApiRes<S> | ((options: UnionOption<S, Partial<P>>) => object)
  onSuccess?(source: ServerApiRes<S>, unionOption: UnionOption<S, Partial<P>>): any
  onError?(option: {
    source?: ServerApiRes<S>
    requestOption?: RequestOption<S, Partial<P>>
    error?: any
  }): UseCommErrHandle
}

export type FetchOption = RequestInit & {
  url: string
  method: RequestMethod
  headers?: any
  body?: any
}

type UnionOption<S = {}, P = {}> = RequestOption<S, P> & FetchOption

const log = logger.getLogger('dev:request')

// 请求错误集中处理
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
// 此处根据 与 api 约定， 如果不是url路径中，则修改这里
const userTokenCtrl = (option: RequestOption): RequestOption => {
  const { params, token = 'auto' } = option
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
    option.params = {
      ...params,
      access_token: userToken,
    }
  }

  return option
}

// 模拟数据
const mockSourceCtrl = async (option: UnionOption) => {
  const { mockSource, onSuccess, sourceKey = '' } = option

  if (config.isProd || !mockSource) {
    return 'none'
  }

  const source: any = typeof mockSource === 'function' ? mockSource(option) : mockSource

  let data = !sourceKey ? source : get(source, sourceKey)

  if (onSuccess) {
    data = await onSuccess(data, option)
  }

  return data
}

// 只缓存 GET 请求
const cacheSourceCtrl = (type: 'set' | 'get', options: UnionOption, resource?: any) => {
  const { url = '', expired = 0, method = 'GET' } = options || {}

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
    const cachedUrl = getSessionStore(url)
    const whenExpired = getSessionStore<string>(timestampKey)

    if (cachedUrl && whenExpired) {
      if (!isExpired(whenExpired)) {
        return cachedUrl
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
        requestErrorCtrl('fetch', option, source)
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
  const { params = {}, body, fetchOption: fetchOpt = {} } = option

  const { url, method } = getUrlByOption(option)
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
    fetchOption.body = JSON.stringify(params)
  }

  if (method !== 'GET') {
    fetchOption.body = body
  }

  return fetchOption
}

async function request<S, P>(option: RequestOption<S, P>): Promise<S | undefined>
async function request(option: RequestOption<any, any>): Promise<any | undefined> {
  const { onSuccess, sourceKey, params = true } = option

  if (params) {
    option.params = omitBy(params as any, (item) => item === undefined || item === null)
  }

  const fetchOptions = getFetchOption(userTokenCtrl(option))
  const unionOption = { ...option, ...fetchOptions }

  // mock数据拦截
  const mockSource = await mockSourceCtrl(unionOption)
  if (mockSource !== 'none') {
    return mockSource
  }

  // 命中缓存 直接返回
  const cachedResponse = cacheSourceCtrl('get', unionOption)
  if (cachedResponse) {
    return cachedResponse
  }

  const resData = await fetchSourceCtrl(unionOption)

  const data = !sourceKey ? resData : get(resData, sourceKey)

  cacheSourceCtrl('set', unionOption, data)

  // 请求成功 回调
  if (onSuccess) {
    return onSuccess(data, unionOption)
  }

  return data
}

export const getUrlByOption = (option: RequestOption) => {
  const { api, params = {}, method = 'GET', urlMode: urlModule = 'api' } = option
  let url = api

  const urlOption = { url, method }

  if (/[GET|POST|PUT|DELETE|PATCH|HEAD] /.test(api)) {
    urlOption.method = `${(/^.*? /.exec(api) || [])[0]}`.replace(' ', '') as RequestMethod
    url = api.replace(/^.*? /, '')
  }

  // url中不存在 '//' 匹配
  if (!/\/\//.test(url)) {
    const urlPrefix = !config.isProd && config.mockUrl ? config.mockUrl : config.urlMode[urlModule]
    if (!urlPrefix) {
      log.error('request.getUrlByOption 解析出错', option)
    }
    url = `${urlPrefix}/${url}`
  }

  // 存在模版标记 tag
  if (/\{/.test(url)) {
    url = filter(url, params)
  }

  if (method === 'GET' && !isEmpty(params)) {
    url += `${url.indexOf('?') === -1 ? '?' : '&'}${qsstringify(params)}`
  }

  urlOption.url = url

  return urlOption
}

export default request
