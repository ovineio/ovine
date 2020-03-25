export type ReqMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'TRACE' | 'HEAD'

export type ReqSuccessHook<S = {}, P = {}> = (
  source: ReqServerApiRes<S>,
  unionOption: ReqUnionOption<S, P>
) => ReqServerApiRes<S>

export type ReqErrorHook<S = {}, P = {}> = (option: {
  source?: ReqServerApiRes<S>
  option?: ReqUnionOption<S, P>
  error?: any
}) => void

export type ReqFetchOption = Omit<RequestInit, 'method'> & {
  url: string
  method: ReqMethod
  headers?: any
  body?: any
}

export type ReqUnionOption<S = {}, P = {}> = ReqOption<S, P> & ReqFetchOption

export type ReqMockSource<S = {}, P = {}> = { [key: string]: ReqMockSourceGen<S, P> }

export type ReqOption<S = {}, P = {}> = {
  api: string // 请求原始api字符串
  url?: string // 默认与 api 一样
  method?: ReqMethod // get
  domain?: string // 'api'
  data?: Partial<P> // {}
  headers?: HeadersInit
  body?: BodyInit | null
  token?: 'none' | 'auto' | 'force' // none
  sourceKey?: string // ''
  expired?: number // 秒数 0
  fetchOption?: Omit<RequestInit, 'header' | 'body'>
  mock?: boolean // 是否启用 mock
  mockSource?: ReqMockSourceGen // 数据生成器
  mockTimeout?: number // 300
  onSuccess?: ReqSuccessHook<S, P> // 接口成功回调
  onError?: ReqErrorHook<S, P> // 接口失败回调
}

export type ReqMockSourceGen<S = {}, P = {}> =
  | ((options: ReqUnionOption<S, P>) => object)
  | ReqServerApiRes<S>

export type ReqServerApiRes<T> = T & {
  code?: number
  data?: T
  msg?: string
  message?: string
  error?: any
}

export type ReqConfig = {
  domains: { [domain: string]: string }
  isRelease?: boolean
}

export type ReqMixObject<T, K> = K & Omit<T, keyof K>
