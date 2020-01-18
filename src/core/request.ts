import hash from 'hash.js'

import config, { UrlMode } from '~/config'
import { UserTokenCheckError } from '~/constants'
import logger from '~/utils/logger'
import { getSessionStorage, setSessionStorage } from '~/utils/store'
import { filterNullKeys, getByPath, isExpired, queryStringify, templateReplace } from '~/utils/tool'

import { getToken } from './user'

const log = logger.getLogger('app:core:request')

class Request implements HttpRequest.Request {
  public getUrlString(option: HttpRequest.RequestOption): string {
    const { noNullDataKeys = true, data } = option
    // 过滤无效 参数
    if (noNullDataKeys && data) {
      option.data = filterNullKeys(data)
    }
    const { url } = this.getUrlOptByApi(option)
    return url
  }

  public getUrlOptByApi(option: HttpRequest.RequestOption): HttpRequest.UrlOption {
    const { api, isMock, data, method = 'GET', urlModule = 'api' } = option
    let url = api

    const urlOption: HttpRequest.UrlOption = { url, method }

    if (/[GET|POST|PUT|DELETE|PATCH] /.test(api)) {
      urlOption.method = `${(/^.*? /.exec(api) || [])[0]}`.replace(' ', '') as HttpRequest.Method
      url = api.replace(/^.*? /, '')
    }
    // url中不存在 '//' 匹配
    if (!/\/\//.test(url)) {
      const module =
        isMock || config.isMock || !urlModule ? config.mockUrl : config.baseUrl[urlModule]
      if (!module) {
        log.error('getUrlOptByApi:参数不正确', option)
      }
      url = `${module}${url}`
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

  public userTokenCtrl(option: HttpRequest.UnionOption): HttpRequest.UnionOption {
    const { url, useToken = 'none' } = option
    const result = option

    // 不需要 token 的情况
    if (useToken === 'none' && url.indexOf('access_token') === -1) {
      return result
    }

    const userToken = getToken()

    // 明确需要 token 但是 token不存在
    if (useToken === 'force' && !userToken) {
      log.error('userTokenCtrl: userToken Error')
      throw UserTokenCheckError
    }

    // url 声明需要 token 但，该请求并不一定要 token
    if (userToken) {
      result.url = `${url}${url.indexOf('?') > -1 ? '&' : '?'}access_token=${userToken}`
    }

    return result
  }

  public cacheRequestCtrl(
    type: 'get' | 'set',
    options?: HttpRequest.UnionOption,
    source?: any
  ): any {
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
      const whenExpired = getSessionStorage<string>(timestampKey)

      if (cached && whenExpired) {
        if (!isExpired(parseInt(whenExpired, 10))) {
          return cached
        }
      }
      return
    }

    // 不存在 response 直接返回
    if (!source) {
      return
    }

    // 所有数据按照 字符串缓存
    setSessionStorage(hashCode, source)
    setSessionStorage(timestampKey, (Date.now() + expired * 1000).toString())
  }

  public getFetchOption(option: HttpRequest.RequestOption): HttpRequest.FetchOption {
    const { headers = {}, data = {}, body = null, credentials = 'omit' } = option
    const defaultFetchOptions: any = {}
    const defaultRequestHeaders: any = {
      Accept: 'application/json',
    }

    const { url, method } = this.getUrlOptByApi(option)

    let fetchBody = body

    if (!body) {
      defaultRequestHeaders['Content-Type'] = 'application/json; charset=utf-8'
      fetchBody = JSON.stringify(data)
    }

    const fetchOption: HttpRequest.FetchOption = {
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

  public errorHandle(
    error?: Error,
    source?: HttpRequest.ApiSource<any>,
    unionOption?: HttpRequest.UnionOption
  ) {
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

  public async request(option: HttpRequest.RequestOption): Promise<any> {
    const { successHandle, noNullDataKeys = true, responsePath = '' } = option

    // 过滤无效 参数
    if (noNullDataKeys && option.data) {
      option.data = filterNullKeys(option.data)
    }

    const fetchOptions: HttpRequest.FetchOption = this.getFetchOption(option)

    let unionOption: HttpRequest.UnionOption = { ...option, ...fetchOptions }

    try {
      unionOption = this.userTokenCtrl(unionOption)
      const cachedResponse = this.cacheRequestCtrl('get', unionOption)

      if (cachedResponse) {
        // 命中缓存 直接返回
        return cachedResponse
      }

      const source = await fetch(unionOption.url, unionOption)

      const status = Number(source.status)

      if (status <= 100 || status >= 500) {
        throw Error('responseStatusError')
      }

      const responseData: any = await (unionOption.method === 'DELETE' || status === 204
        ? source.text()
        : source.json())

      const data = !responsePath ? responseData : getByPath(responseData, responsePath)

      log.log('dev:request', `[${unionOption.api}]`, responseData, unionOption.data)

      this.cacheRequestCtrl('set', unionOption, data)

      // 请求成功 回调
      if (successHandle) {
        return await successHandle(data, unionOption)
      }

      return data
    } catch (error) {
      // 请求失败 公共处理方法
      this.errorHandle(error, undefined, unionOption)
    }
  }
}

const requestInstance = new Request()

export type RequestOption = HttpRequest.RequestOption & {
  urlMode?: UrlMode
}
const request = (option: RequestOption) => requestInstance.request(option)

export const getUrlString = (option: RequestOption) => requestInstance.getUrlString(option)

export default request
