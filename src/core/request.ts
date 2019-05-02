import hash from 'hash.js'
import { config } from '@config'
import { templateReplace, getByPath, queryStringify, isExpired, filterNullKeys } from '@utils/tool'
import { getSessionStorage, setSessionStorage } from '@utils/store'
import logger from '@utils/logger'

type UrlOption = {
  url: string
  method: RequestMethod
}

// 接口反馈数据格式 定义
export interface IApiResource<T> {
  code?: number
  data?: T
  msg?: string
  message?: string
  error?: any
}

export type RequestMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD'

export interface IRequestOption {
  /**
   * 请求的接口 API 需要符合 `REQUEST_METHOD API_STRING` 格式默认是 GET 请求
   * @requires
   */
  api: string
  /**
   * 接口的 参数数据，当为 GET 请求时，会自动拼接搭配 URL 中，为非 GET 请求时，会使用 FormData 放入，Request.body中
   * @default {}
   */
  data?: any
  /**
   * 是否过滤参数中值为 `null`、`undefined`、`{}`的key。
   * @default true
   */
  noNullDataKeys?: boolean
  /**
   * 当上传文件时，或者 FormData 时使用，参数
   * @default {}
   */
  body?: any
  /**
   * http 协议方法
   * @default {}
   */
  method?: RequestMethod
  /**
   * http 协议请求设置
   * @default 'GET'
   */
  headers?: any
  /**
   * isMock true 时，默认走 config中的 mockBaseurl
   * @default false
   */
  isMock?: boolean
  /**
   * 请求的url模块
   * @default 'api'
   */
  urlModule?: string
  /**
   * 是否使用用户的token。
   * @default 'none'
   * - `none` 表示不需要token
   * - `auto` 可要可不要token,有 token 时自动带上 token 请求
   * - `force` 必须使用token, 不存在 token 时，前端拦截报错，并自动调用 `user.handleUserTokenExpired` 处理
   */
  useToken?: 'none' | 'auto' | 'force' // 使用用户token
  /**
   * 获取返回数据的有效`path`
   * @default false
   */
  responsePath?: string | false
  /**
   * 不使用公共的错误处理
   * @default false 使用公共错误处理
   */
  disableErrorHandle?: boolean
  /**
   * 设置缓存时间，防止统一请求 段时间多次请求, 单位毫秒
   * @default undefined 不设置缓存
   */
  expired?: number
  /**
   * http 协议credentials参数
   * @default -1 不设置
   */
  credentials?: 'omit' | 'same-origin' | 'include' | undefined
  /**
   * 由于 request 捕获了所有 error ，因此要处理 error errorHandle 必须传，
   * 而不是用 try catch 或者 .cache 方法
   * @param error 当前请求的错误
   * @param source 请求携带的返回数据。可能为 undefined
   * @param unionOption 当前请求时的各种参数选项
   * @return `CustomTypes.FalseValue` 当返回一个类false值，不进行公共错误处理
   */
  errorHandle?(
    error?: any,
    source?: IApiResource<any>,
    unionOption?: UnionOption
  ): CustomTypes.FalseValue | boolean
  /**
   * 数据请求成功后的回调。可以使用`.then`方法直接处理，成功后的回调，也可传入该参数。
   * @param source 请求携带的返回数据。可能为 undefined
   * @param unionOption 当前请求时的各种参数选项
   * @return Promise<any> 返回任何值
   */
  successHandle?(source: any, unionOption: UnionOption): any
}

export type RequestMap = CustomTypes.ObjectOf<IRequestOption>

export interface IFetchOption extends RequestInit {
  url: string
  method: RequestMethod
  body?: string
}

type UnionOption = IRequestOption & IFetchOption

const log = logger.getLogger('public:request')

// 解析 api获取 url 参数
const getUrlOptByApi = (option: IRequestOption): UrlOption => {
  const { api, isMock, data, method = 'GET', urlModule = 'api' } = option
  let url = api

  const urlOption: UrlOption = { url, method }

  if (/[GET|POST|PUT|DELETE|PATCH] /.test(api)) {
    urlOption.method = `${(/^.*? /.exec(api) || [])[0]}`.replace(' ', '') as RequestMethod
    url = api.replace(/^.*? /, '')
  }
  // url中不存在 '//' 匹配
  if (!/\/\//.test(url)) {
    const module =
      isMock || config.isMock || !urlModule ? config.mockUrl : config.baseUrl[urlModule]
    if (!module) {
      log.error('getUrlOptByApi:参数不正确', option)
    }
    url = `${module}/${url}`
  }

  // 存在模版标记 tag
  if (/\{/.test(url)) {
    url = templateReplace(url, data)
  }

  if (method === 'GET' && data) {
    url += `${url.indexOf('&') > -1 ? '&' : url.indexOf('?') === -1 ? '?' : ''}${queryStringify(
      data
    )}`
  }

  urlOption.url = url

  return urlOption
}

// 获取 url
export function getUrlString(option: IRequestOption): string {
  const { noNullDataKeys = true, data } = option
  // 过滤无效 参数
  if (noNullDataKeys && data) {
    option.data = filterNullKeys(data)
  }
  const { url } = getUrlOptByApi(option)
  return url
}

// 请求相关的错误集中处理
const errorHandle = (error?: Error, source?: IApiResource<any>, unionOption?: UnionOption) => {
  const { errorHandle: handle = false, disableErrorHandle = false } = unionOption || {}

  // 请求失败回调
  let handleResult: CustomTypes.FalseValue = !disableErrorHandle // 是否执行公共 请求错误处理

  if (handle) {
    handleResult = handle(error, source, unionOption)
  }

  if (!handleResult) {
    return
  }

  if (error) {
    throw error
  }
}

/**
 * 接口缓存策略，防止短时间内多次 GET 相同请求浪费资源。根据 `expired` 参数确定是否开启
 * 不开启则无任何效果
 */
const cacheRequestCtrl = (type: 'get' | 'set', options?: UnionOption, resource?: any): any => {
  const { url = '', expired = 0, method = 'GET' } = options || {}

  if (!expired || method !== 'GET' || !window.sessionStorage) {
    return
  }

  const fingerprint = url
  const hashCode: any = hash
    .sha256()
    .update(fingerprint)
    .digest('hex')
  const timestampKey: any = `${hashCode}:timestamp`

  if (type === 'get') {
    const cached = getSessionStorage(hashCode)
    const whenExpired = getSessionStorage<string, string>(timestampKey)

    if (cached && whenExpired) {
      if (!isExpired(parseInt(whenExpired, 10))) {
        return cached
      }
    }
    return
  }

  // 不存在 response 直接返回
  if (!resource) {
    return
  }

  // 所有数据按照 字符串缓存
  setSessionStorage(hashCode, resource)
  setSessionStorage(timestampKey, (Date.now() + expired * 1000).toString())
}

const defaultRequestHeaders: any = {
  Accept: 'application/json',
}

const defaultFetchOptions: Partial<IFetchOption> = {
  // credentials: 'include',
}

// 获取Fetch参数
const getFetchOption = (option: IRequestOption): IFetchOption => {
  const { headers = {}, data = {}, body = null, credentials = 'omit' } = option

  const { url, method } = getUrlOptByApi(option)

  let fetchBody = body

  if (!body) {
    defaultRequestHeaders['Content-Type'] = 'application/json; charset=utf-8'
    fetchBody = JSON.stringify(data)
  }

  const fetchOption: IFetchOption = {
    ...defaultFetchOptions,
    credentials,
    url,
    method,
    headers: {
      ...defaultRequestHeaders,
      ...headers,
    },
  }

  if (method !== 'GET') {
    fetchOption.body = fetchBody
  }

  return fetchOption
}

export async function request(option: IRequestOption): Promise<any> {
  const { successHandle, noNullDataKeys = true, responsePath = '' } = option

  // 过滤无效 参数
  if (noNullDataKeys && option.data) {
    option.data = filterNullKeys(option.data)
  }

  const fetchOptions: IFetchOption = getFetchOption(option)

  const unionOption: UnionOption = { ...option, ...fetchOptions }

  try {
    const cachedResponse = cacheRequestCtrl('get', unionOption)

    if (cachedResponse) {
      // 命中缓存 直接返回
      return cachedResponse
    }

    const responseData = await fetchSource(unionOption.url, unionOption)

    log.log('dev:request', `[${unionOption.api}]`, responseData, unionOption.data)

    const data = !responsePath ? responseData : getByPath(responseData, responsePath)

    cacheRequestCtrl('set', unionOption, data)
    // 请求成功 回调
    if (successHandle) {
      return await successHandle(data, unionOption)
    }

    return data
  } catch (error) {
    // 请求失败 公共处理方法
    errorHandle(error, undefined, unionOption)
  }
}

const inIn9 = () => {
  if (typeof navigator === 'undefined') {
    return false
  } else {
    return navigator.userAgent.indexOf('MSIE 9') > 0
  }
}

const ie9 = inIn9()
function fetchSource(url: string, options: any = {}) {
  if (ie9 && (window as any).XDomainRequest) {
    return fetchIe9(url, options)
  }

  return fetch(url, options).then((source) => {
    const status = Number(source.status)

    if (status <= 100 || status >= 500) {
      throw Error('responseStatusError')
    }

    if (options.method === 'DELETE' || status === 204) {
      return source.text()
    }

    return source.json()
  })
}

// 兼容IE9跨域请求
function fetchIe9(url: string, options: any = {}) {
  // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
  return new Promise((resolve, reject) => {
    const method = options.method || 'GET'
    const timeout = options.timeout || 30000
    let data = options.body || options.params || null
    if (data && data instanceof Object) {
      data = JSON.stringify(data)
    }
    const XDR = new (window as any).XDomainRequest()
    XDR.withCredentials = true
    XDR.timeout = timeout
    XDR.onload = () => {
      try {
        const json = JSON.parse(XDR.responseText)
        return resolve(json)
      } catch (e) {
        reject(e)
      }
      return reject({})
    }
    // fix random aborting: https://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
    XDR.ontimeout = () => reject('XDomainRequest timeout')
    XDR.onerror = () => reject('XDomainRequest error')
    XDR.open(method, url)
    setTimeout(() => {
      XDR.send(data)
    }, 0)
  })
}

export default request
