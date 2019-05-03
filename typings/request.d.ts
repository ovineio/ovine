declare namespace HttpRequest {
  type ApiSource<T> = {
    code?: number
    data?: T
    msg?: string
    message?: string
    error?: any
    [key: string]: any
  }

  type Method = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD'

  type RequestOption = {
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
    method?: Method
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
      source?: ApiSource<any>,
      unionOption?: UnionOption
    ): false | null | undefined
    /**
     * 数据请求成功后的回调。可以使用`.then`方法直接处理，成功后的回调，也可传入该参数。
     * @param source 请求携带的返回数据。可能为 undefined
     * @param unionOption 当前请求时的各种参数选项
     * @return Promise<any> 返回任何值
     */
    successHandle?(source: any, unionOption: UnionOption): any
  }

  type FetchOption = RequestInit & {
    url: string
    method: Method
    body?: string
  }

  type UnionOption = RequestOption & FetchOption

  type UrlOption = {
    url: string
    method: Method
  }

  type RequestMap = { [key: string]: RequestOption }

  class Request {
    getUrlString(option: RequestOption): string
    getUrlOptByApi(option: RequestOption): UrlOption
    cacheRequestCtrl(type: 'get' | 'set', options?: UnionOption, source?: any): any
    userTokenCtrl(options: UnionOption): UnionOption
    getFetchOption(option: RequestOption): FetchOption
    errorHandle(error?: Error, source?: ApiSource<any>, unionOption?: UnionOption): void
    request(option: RequestOption): Promise<any>
  }
}
