/**
 * 封装 fetch 请求
 * TODO: 请求模块需要 编写测试用例
 */

/* eslint-disable consistent-return */
import { getApiCache, setApiCache } from 'amis/lib/utils/api'
import { object2formData, qsstringify, hasFile } from 'amis/lib/utils/helper'
import { filter } from 'amis/lib/utils/tpl'
import { get, map, isPlainObject, isFunction, toUpper, pick, assign } from 'lodash'
import { parse } from 'qs'
import { fetch } from 'whatwg-fetch'

import logger from '@/utils/logger'
import { getSessionStore, setSessionStore } from '@/utils/store'
import { isExpired, promisedTimeout, rmUrlRepeatSlant } from '@/utils/tool'

import { saveFile } from '../file'

import * as Types from './types'

const log = logger.getLogger('lib:utils:request')

// 请求错误集中处理， 必须 throw 错误
function requestErrorCtrl(this: Request, error: Error, option: Types.ReqOption, response?: any) {
  // log.info('requestErrorCtrl', { error, option, response })
  const errorSource = { option, response, error }

  let withInsErrorHook: any = true

  // 如果返回 false，则不调用 全局的错误处理
  if (option.onError) {
    withInsErrorHook = option.onError(response, option, error)
  }

  if (withInsErrorHook !== false && this.onError) {
    this.onError(response, option, error)
  }

  if (this.onFinish) {
    this.onFinish(response, option, error)
  }

  throw errorSource
}

// 请求成功集中处理
async function requestSuccessCtrl(this: Request, response: any, option: Types.ReqOption) {
  if (this.onSuccess) {
    const res = wrapResponse(response)
    response.data = this.onSuccess(res.data, option, res)
  }

  if (option.onSuccess) {
    const res = wrapResponse(response)
    response.data = await option.onSuccess(res.data, option, res)
  }

  if (this.onFinish) {
    this.onFinish(wrapResponse(response), option)
  }
}

// 模拟数据
async function mockSourceCtrl(this: Request, option: Types.ReqOption) {
  const { mockSource, api, method, url, mock = true, mockDelay = 200 } = option
  if (!this.isMock || !mock || !mockSource) {
    return 'none'
  }

  const apiStr = api || `${method} ${url || ''}`

  // mock数据生成方式
  const mockSourceGen = get(mockSource, apiStr) ? (mockSource as any)[apiStr] : mockSource

  // mock 原始数据
  const fakeRes: any = {}
  fakeRes.data = isFunction(mockSourceGen) ? mockSourceGen(option) : mockSourceGen

  await requestSuccessCtrl.call(this, fakeRes, option)

  if (mockDelay) {
    await promisedTimeout(mockDelay)
  }

  log.log('mockSource', option.url, fakeRes.data, option)

  return fakeRes
}

// 缓存请求 只缓存 GET 请求
function cacheSourceCtrl(type: 'set' | 'get', option: Types.ReqOption, resource?: any) {
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
    setSessionStore(timestampKey, (Date.now() + expired).toString())
    return
  }

  if (type === 'get') {
    const cached = getSessionStore(url)
    const whenExpired = getSessionStore<string>(timestampKey)

    if (cached && whenExpired) {
      if (!isExpired(whenExpired)) {
        log.log('expiredSource', option.url, cached, option)
        return cached
      }
    }
  }
}

// 读取json结果,非JSON结果 在 request 模块处理
async function readJsonResponse(response: any) {
  try {
    const text = await response.text()
    response.responseText = text
    const data = JSON.parse(text)
    delete response.responseText // 如果解析成功 将responseText 参数删除
    return data
  } catch (e) {
    return {}
  }
}

function saveFileFromRes(options: { blob: any; disposition: string }) {
  const { blob, disposition } = options
  const fileName = get(/filename="(.*)"$/.exec(disposition), '1')

  saveFile(blob, fileName ? decodeURIComponent(fileName) : undefined)
}

// 发出 fetch 请求
async function fetchSourceCtrl(this: Request, option: Types.ReqOption) {
  const { url, body, config, responseType } = option

  if (config.onUploadProgress && body && typeof XMLHttpRequest !== 'undefined') {
    const result = await uploadWithProgress.call(this, option)
    return result
  }

  const result = await fetch(url, option)
    .catch((error: any) => {
      requestErrorCtrl.call(this, error, option, wrapResponse())
    })
    .then(async (response: any) => {
      // 当 fetch 发生错误时 不做任何处理
      if (!response) {
        return
      }

      const status = Number(response.status)

      if (status <= 100 || status >= 400) {
        try {
          response.data = await readJsonResponse(response)
        } catch (e) {
          //
        }
        requestErrorCtrl.call(
          this,
          new Error('status <= 100 || status >= 400'),
          option,
          wrapResponse(response)
        )
        return
      }

      try {
        if (responseType === 'blob' || config.responseType === 'blob') {
          const blob = await response.blob()
          response.data = { blob }
          saveFileFromRes({ blob, disposition: response.headers.get('Content-Disposition') || '' })
        } else {
          response.data = await readJsonResponse(response)
        }
        await requestSuccessCtrl.call(this, response, option)
        return response
      } catch (error) {
        requestErrorCtrl.call(this, error as Error, option, wrapResponse(response))
      }
    })

  return result
}

async function fakeSourceCtrl(this: Request, option: Types.ReqOption) {
  const fakeReq: any = option.onFakeRequest
  const fakeRes = await fakeReq(option)
  const fakeResponse = option.withoutWrapRes ? fakeRes : wrapResponse(fakeRes)
  return {
    data: fakeResponse,
  }
}

// fetch 添加 onUploadProgress 支持
function uploadWithProgress(this: Request, option: Types.ReqOption) {
  const errorCtrl = requestErrorCtrl.bind(this)
  const successCtrl = requestSuccessCtrl.bind(this)

  return new Promise((resolve) => {
    const { config, method = '', url = '', headers = {}, body } = option

    let xhr: XMLHttpRequest | null = new XMLHttpRequest()

    xhr.open(method.toLowerCase(), url, true)

    // 兼容 withCredentials 与 credentials 参数
    const credentials = option.fetchOptions?.credentials
    if (config.withCredentials || (credentials && credentials !== 'omit')) {
      xhr.withCredentials = true
    }

    map(headers, (header, key) => {
      if (xhr) {
        xhr.setRequestHeader(key, header)
      }
    })

    function onXhrError(status: any, text: string) {
      errorCtrl(
        new Error(text),
        option,
        wrapResponse(
          {
            status,
            data: xhr?.response || xhr?.responseText,
            statusText: xhr?.statusText,
          },
          true
        )
      )
      xhr = null
    }

    xhr.onreadystatechange = function() {
      if (!xhr || xhr.readyState !== 4) {
        return
      }
      if (xhr.status === 0 && !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0)) {
        return
      }

      const responseHeaders = xhr?.getAllResponseHeaders() || {}
      const response: any = {
        data: xhr.response || xhr.responseText,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
      }

      if (this.status <= 100 || this.status >= 400) {
        errorCtrl(new Error('status <= 100 || status >= 400'), option, wrapResponse(response, true))
      } else {
        successCtrl(wrapResponse(response, true), option).then(() => {
          resolve(response)
        })
      }
    }

    xhr.onerror = function() {
      onXhrError(this.status, 'Network Error')
    }

    xhr.ontimeout = function() {
      onXhrError(this.status, 'TimeOut Error')
    }

    if (xhr.upload && config.uploadProgress) {
      xhr.upload.onprogress = config.uploadProgress
    }

    xhr.send(body)
  })
}

// 获取 fetch 参数
function getFetchOption(this: Request, option: Types.ReqOption): any {
  const { headers, data = {}, fetchOptions, body, dataType = 'json', qsOptions } = option

  const { url, method } = getUrlByOption.call(this, option) as any

  // 自行实现取消请求的回调
  const { cancelExecutor, withCredentials } = option.config || {}

  let signal = null
  if (cancelExecutor && typeof AbortController !== 'undefined') {
    const controller = new AbortController()
    signal = controller.signal
    cancelExecutor(() => {
      controller.abort()
    })
  }

  /**
   * amis dataType 逻辑
   */

  // fetch 请求参数封装
  let fetchBody
  const fetchHeaders = headers
  if (!/GET|HEAD|OPTIONS/i.test(method)) {
    if (data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
      fetchBody = data
    } else if (hasFile(data) || dataType === 'form-data') {
      fetchBody = object2formData(data, qsOptions)
    } else if (dataType === 'form') {
      fetchBody = qsstringify(data, qsOptions)
      fetchHeaders['Content-Type'] = 'application/x-www-form-urlencoded'
    } else if (dataType === 'json') {
      fetchBody = JSON.stringify(assign({}, body, data))
      fetchHeaders['Content-Type'] = 'application/json'
    }
  }

  const fetchOption = {
    ...fetchOptions,
    signal,
    url,
    method,
    headers: fetchHeaders,
    body: fetchBody,
  }

  // 兼容 withCredentials 参数
  if (withCredentials && !fetchOption.credentials) {
    fetchOption.credentials = 'include'
  }

  return fetchOption
}

// 确保 data 一定是对象
function wrapResponse(response?: any, transJson?: boolean) {
  if (!response) {
    const fakeRes: any = { data: {} }
    return fakeRes
  }
  if (typeof response.data === 'undefined') {
    response.data = {}
  } else if (!isPlainObject(response.data)) {
    if (!transJson) {
      response.data = { value: response.data }
      return response
    }
    try {
      response.data = JSON.parse(response.data)
      return response
    } catch (_) {
      //
    }
  }

  return response
}

// 获取请求参数
async function getReqOption(this: Request, option: Types.ReqOption): Promise<Types.ReqOption> {
  // 对象参数 先填充默认值
  let opt: Types.ReqOption = {
    fetchOptions: {},
    headers: {},
    config: {},
    ...option,
    ...normalizeUrl(option.url || option.api || '', option.method),
  }

  const { actionAddr, api, onPreRequest, onRequest } = opt

  opt.api = api || option.url
  opt.actionAddr = actionAddr || opt.api

  if (!opt.url) {
    log.error('请求一定要传 url 参数', option)
    requestErrorCtrl.call(this, new Error('请求一定要传 url 参数'), wrapResponse())
  }

  if (this.onPreRequest) {
    opt = this.onPreRequest(opt)
  }

  if (onPreRequest) {
    opt = await onPreRequest(opt)
  }

  let reqOption = { ...opt, ...getFetchOption.call(this as any, opt) }

  if (this.onRequest) {
    reqOption = this.onRequest(reqOption)
  }

  if (onRequest) {
    reqOption = onRequest(reqOption)
  }

  return reqOption
}

// 处理格式化 URL 字符串
export function normalizeUrl(urlStr: string, defMethod?: string) {
  let method = toUpper(defMethod)
  let url = urlStr

  if (/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS) /i.test(url)) {
    const [apiMethod, apiStr] = urlStr.split(' ')
    method = apiMethod
    url = apiStr
  }

  return {
    url,
    method: (toUpper(method) || 'GET') as Types.ReqMethod,
  }
}

// 获取 url 参数
export function getUrlByOption(
  this: Types.ReqConfig,
  option: Types.ReqOption & Partial<Types.ReqConfig>
) {
  const { qsOptions, data, domain = 'api', domains, url: optUrl = '', method } = option
  const urlOption = { url: optUrl, method }
  const apiDomains = domains || this.domains || {}

  let url = optUrl

  // url中不存在 'http' 匹配
  if (!/^https?:\/\//.test(url)) {
    const urlPrefix = apiDomains[domain]
    if (!urlPrefix) {
      log.error('request.getUrlByOption 解析出错', option)
    }
    url = `${urlPrefix}/${url}`
  }

  // 删除多于的斜杠
  url = rmUrlRepeatSlant(url)

  const idx = url.indexOf('?')
  const hashIdx = url.indexOf('#')
  const hasString = hashIdx !== -1 ? url.substring(hashIdx) : ''

  if (/\$/.test(url)) {
    url = filter(url, data)
  }

  // 添加 get 请求参数
  if (urlOption.method === 'GET' && data) {
    if (idx !== -1) {
      const urlParams = parse(url.substring(idx + 1, hashIdx !== -1 ? hashIdx : undefined))
      const params = {
        ...urlParams,
        ...data,
      }
      url = `${url.substring(0, idx)}?${qsstringify(params, qsOptions)}${hasString}`
    } else {
      url += `?${qsstringify(data, qsOptions)}${hasString}`
    }
  }

  urlOption.url = url

  return urlOption
}

// 使用 class 能够更容易重写 request 的一些回调值
export class Request<IS = {}, IP = {}> {
  constructor(config?: Types.ReqConfig) {
    this.setConfig(config)
  }

  // 配置的域名
  public domains: { [domain: string]: string } = {}

  // 是否是Mock环境
  public isMock?: boolean

  // 请求预处理阶段
  public onPreRequest?: (option: Types.ReqOption) => Types.ReqOption

  // 发送请求前
  public onRequest?: (option: Types.ReqOption) => Types.ReqOption

  // 错误回调
  public onError?: (response: Types.ReqResponse, option: Types.ReqOption, error: Error) => void

  // 请求成功回调
  public onSuccess?: (source: any, option: Types.ReqOption, response: Types.ReqResponse) => any

  // 请求结束回调
  public onFinish?: (response: Types.ReqResponse, option: Types.ReqOption, error?: Error) => void

  // 设置配置
  public setConfig(config?: Types.ReqConfig) {
    const { domains = {}, isMock } = config || {}
    this.domains = domains
    this.isMock = isMock
  }

  // 解析请求参数
  public getUrlByOption(option: Types.ReqOption<IS, IP>) {
    return getUrlByOption.call(this, option as any)
  }

  // 请求
  public async request<S = {}, P = {}>(
    option: Types.ReqOption<S | IS, P | IP>
  ): Promise<Types.ReqResponse<S | IS> | undefined>

  // eslint-disable-next-line no-dupe-class-members
  public async request(option: any, params?: any): Promise<any> {
    const that: any = this

    if (params) {
      option.data = {
        ...option.data,
        ...params,
      }
    }

    // 获取请求参数
    const reqOption = await getReqOption.call(that, option)
    const { onFakeRequest } = option

    // 命中缓存 直接返回
    const cachedResponse = cacheSourceCtrl('get', reqOption)
    if (cachedResponse) {
      return {
        data: cachedResponse,
      }
    }

    // mock 数据拦截
    const mockSource = await mockSourceCtrl.call(that, reqOption)
    if (mockSource !== 'none') {
      cacheSourceCtrl('set', reqOption, mockSource.data)
      return mockSource
    }

    // 兼容 cache 参数, 用于多请求并发情况
    if (reqOption.method === 'GET' && reqOption.cache && reqOption.cache > 0) {
      const apiObj: any = pick(reqOption, ['url', 'cache', 'method', 'data'])
      const apiCache: any = getApiCache(apiObj)

      log.debounce(() =>
        log.log(onFakeRequest ? 'fakeCacheSource' : 'cacheSource', reqOption.url, reqOption)
      )

      if (apiCache) {
        return apiCache.cachedPromise
      }

      // 伪装 请求 也支持缓存
      const cachedPromise = onFakeRequest
        ? fakeSourceCtrl.call(that, reqOption)
        : fetchSourceCtrl.call(that, reqOption)

      setApiCache(apiObj, cachedPromise)

      return cachedPromise
    }

    // 伪装 请求 直接返回数据
    if (onFakeRequest) {
      const fakeResponse = await fakeSourceCtrl.call(that, reqOption)
      log.log('[fakeSource]', option.url, fakeResponse.data, reqOption)
      return fakeResponse
    }

    const response = await fetchSourceCtrl.call(that, reqOption)

    cacheSourceCtrl('set', reqOption, response.data)

    log.log('[apiSource]', reqOption.url, response.data, reqOption)

    return response
  }
}
