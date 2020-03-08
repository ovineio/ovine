declare namespace Req {
  type Method = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD'

  type SuccessHook<S = {}, P = {}> = (
    source: ServerApiRes<S>,
    unionOption: UnionOption<S, P>
  ) => ServerApiRes<S>

  type ErrorHook<S = {}, P = {}> = (option: {
    source?: ServerApiRes<S>
    option?: UnionOption<S, P>
    error?: any
  }) => void

  type FetchOption = Omit<RequestInit, 'method'> & {
    url: string
    method: Method
    headers?: any
    body?: any
  }

  type UnionOption<S = {}, P = {}> = Option<S, P> & FetchOption

  type MockSource<S = {}, P = {}> = { [key: string]: MockSourceGen<S, P> }

  type Option<S = {}, P = {}> = {
    api: string // 请求原始api字符串
    url?: string // 默认与 api 一样
    method?: Method // get
    domain?: string // 'api'
    data?: Partial<P> // {}
    headers?: HeadersInit
    body?: BodyInit | null
    token?: 'none' | 'auto' | 'force' // none
    sourceKey?: string // ''
    expired?: number // 秒数 0
    fetchOption?: Omit<RequestInit, 'header' | 'body'>
    mock?: boolean // 是否启用 mock
    mockSource?: MockSourceGen // 数据生成器
    mockTimeout?: number // 300
    onSuccess?: SuccessHook<S, P> // 接口成功回调
    onError?: ErrorHook<S, P> // 接口失败回调
  }

  type MockSourceGen<S = {}, P = {}> = ((options: UnionOption<S, P>) => object) | ServerApiRes<S>

  type ServerApiRes<T> = T & {
    code?: number
    data?: T
    msg?: string
    message?: string
    error?: any
  }

  type Config = {
    domains: { [domain: string]: string }
    isRelease?: boolean
  }

  type MixObject<T, K> = K & Omit<T, keyof K>
}
