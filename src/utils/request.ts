import hash from 'hash.js'

import logger from './logger'
import { getSessionStorage, setSessionStorage } from './store'
import { filterNullKeys, getByPath, isExpired } from './tool'

const log = logger.getLogger('app:request')

export class ApiRequest extends HttpRequest.Request {
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
      const whenExpired = getSessionStorage<string, string>(timestampKey)

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

      const responseData: any =
        unionOption.method === 'DELETE' || status === 204 ? source.text() : source.json()

      log.log('dev:request', `[${unionOption.api}]`, responseData, unionOption.data)

      const data = !responsePath ? responseData : getByPath(responseData, responsePath)

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
