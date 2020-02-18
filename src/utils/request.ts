/**
 * 封装 fetch 请求
 */
import { qsstringify } from 'amis/lib/utils/helper'
import { filter } from 'amis/lib/utils/tpl'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { fetch } from 'whatwg-fetch'

import logger from '~/utils/logger'
import { getSessionStore, setSessionStore } from '~/utils/store'
import { isExpired, queryStringParse } from '~/utils/tool'

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

export type MockSourceGen<S = {}, P = {}> =
  | ((options: UnionOption<S, P>) => object)
  | ServerApiRes<S>

export type ReqSucHook<S = {}, P = {}> = (
  source: ServerApiRes<S>,
  unionOption: UnionOption<S, P>
) => ServerApiRes<S>

export type ReqErrorHook<S = {}, P = {}> = (option: {
  source?: ServerApiRes<S>
  option?: UnionOption<S, P>
  error?: any
}) => void

export type MockSource<S = {}, P = {}> = Types.ObjectOf<MockSourceGen<S, P>>

export type RequestOption<S = {}, P = {}> = {
  url: string // required
  api?: string // 默认与 url 一样
  method?: RequestMethod // get
  urlMode?: string // 'api'
  data?: Partial<P> // {}
  body?: any
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
function requestErrorCtrl(this: Request, option: UnionOption, response: any, error: any) {
  const { onError: handle = false } = option

  log.info('requestErrorCtrl', { response, error })

  if (this.onError) {
    this.onError({ option, response, error })
  }

  // 不执行全局 onError
  if (handle) {
    handle({ option, error, source: response })
  }

  if (this.onFinish) {
    this.onFinish({ option, response, error })
  }
}

function timeout(ms: number) {
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
async function fetchSourceCtrl(this: Request, option: UnionOption) {
  const { url, sourceKey, onSuccess } = option

  const reqOption = !this.onRequest ? option : this.onRequest(option)

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
      }

      let origin = response.json()

      if (this.onResponse) {
        origin = this.onResponse({ option, response, source: origin })
      }

      const source = !sourceKey ? origin : get(origin, sourceKey)
      const data = !onSuccess ? source : await onSuccess(source, option)

      if (this.onFinish) {
        this.onFinish({ option, response, source: data })
      }
    })

  return result
}

// 获取 fetch 参数
function getFetchOption(this: Request, option: RequestOption): FetchOption {
  const { data = {}, body, fetchOption: fetchOpt = {} } = option

  const { url, method } = getUrlByOption.call(this, option) as any
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

  if (!body && !fetchOption.headers['Content-Type']) {
    fetchOption.headers['Content-Type'] = 'application/json; charset=utf-8'
  }

  if (hasBody) {
    fetchOption.body = body ? body : JSON.stringify(data)
  }

  return fetchOption
}

export function getUrlByOption(
  this: RequestConfig,
  option: RequestOption & Partial<RequestConfig>
) {
  const { url, data = {}, method = 'GET', urlMode = 'api', domains } = option

  let realUrl = url

  const urlOption = { url, method: method.toUpperCase() }
  const params = omitBy(data as any, (item) => item === undefined || item === null)

  if (/[GET|POST|PUT|DELETE|PATCH|HEAD] /.test(realUrl)) {
    urlOption.method = `${(/^.*? /.exec(url) || [])[0]}`.replace(' ', '') as RequestMethod
    realUrl = realUrl.replace(/^.*? /, '')
  }

  const apiDomains = domains || this.domains || {}

  // url中不存在 '//' 匹配
  if (!/\/\//.test(realUrl)) {
    const urlPrefix = apiDomains[urlMode]
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

type RequestConfig = { domains: Types.ObjectOf<string>; isRelease?: boolean }
export class Request {
  public onRequest?: (option: RequestOption) => RequestOption

  public onFinish?: (option: {
    option: UnionOption
    response: Response
    error?: any
    source?: any
  }) => void

  public onError?: (option: { option: UnionOption; response: Response; error?: any }) => any

  public onResponse?: (option: { option: UnionOption; response: Response; source?: any }) => any

  public isRelease?: boolean = false
  public domains: Types.ObjectOf<string> = {}

  constructor(config: RequestConfig) {
    const { domains = {}, isRelease } = config || {}
    this.domains = domains
    this.isRelease = isRelease
  }

  public async request<S, P>(option: RequestOption<S, P>): Promise<ServerApiRes<S> | undefined>
  public async request(option: RequestOption<any, any>): Promise<any | undefined> {
    const { data: params, url, api } = option
    option.api = api || url

    const query: any = queryStringParse('', url)
    if (query) {
      option.url = url.split('?')[0]
      option.data = { ...query, ...params }
    }

    const unionOption = { ...option, ...getFetchOption.call(this, option) }

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

    const result = await fetchSourceCtrl.call(this, unionOption)

    cacheSourceCtrl('set', unionOption, result)

    log.log('apiSource', unionOption.url, result, unionOption)

    return result
  }
}
