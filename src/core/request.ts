import config, { UrlMode } from '@config'
import { templateReplace, filterNullKeys, queryStringify } from '@utils/tool'
import { ApiRequest } from '@utils/request'
import { UserTokenCheckError } from '@constants/error'
import logger from '@utils/logger'

import { getToken } from './user'

const log = logger.getLogger('app:core:request')

class Request extends ApiRequest {
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
}

const requestInstance = new Request()

type Option = HttpRequest.RequestOption & {
  urlMode: UrlMode
}
const request = (option: Option) => requestInstance.request(option)

export const getUrlString = (option: Option) => requestInstance.getUrlString(option)

export default request
