export type ReqMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type ReqSuccessHook<S = any, P = any> = (
  data: S,
  option: ReqOption<S, P>,
  response: ReqResponse<S>
) => S

export type ReqResponse<S = any> = Partial<Response> & {
  data: ReqApiRes<S>
}

export type ReqErrorHook<S = any, P = any> = (
  response: ReqApiRes<S>,
  option: ReqOption<S, P>,
  error: Error
) => undefined | boolean

export type ReqMockSource<S = any, P = any> = { [key: string]: ReqMockSourceGen<S, P> }

export type ReqOption<S = any, P = any> = {
  api?: string // 请求原始api字符串
  url?: string // 默认与 api 一样
  method?: ReqMethod // 请求方法
  domain?: string // 当前域名的 key 数值简写
  data?: Partial<P> // 请求数据
  headers?: any // 请求头
  body?: any // 请求体
  dataType?: 'json' | 'form-data' | 'form' // 提交类型
  expired?: number // 请求超时时间毫秒数 0
  fetchOptions?: Omit<RequestInit, 'header' | 'body' | 'signal' | 'url' | 'method'> // fetch 参数
  qsOptions?: any // qs 模块请求参数处理
  mock?: boolean // 是否启用 mock
  mockSource?: ReqMockSourceGen // 数据生成器
  mockDelay?: number // 300
  actionAddr?: string // 操作地址，不存在时默认为 api
  actionDesc?: string // 操作描述文案 与操作地址对应
  isEnvFetcher?: boolean // 是否是 amis env 发出的请求
  onUploadProgress?: (event: { loaded: number; total: number }) => void // 处理上传进度条回调
  onPreRequest?: (option: ReqOption) => ReqOption // 请求前回调
  onRequest?: (option: ReqOption) => ReqOption // 请求时回调
  onSuccess?: ReqSuccessHook<S, P> // 接口成功回调
  onError?: ReqErrorHook<S, P> // 接口失败回调
  [key: string]: any // 用户扩展字段
}

export type ReqMockSourceGen<S = any, P = any> =
  | ((options: ReqOption<S, P>) => object)
  | ReqApiRes<S>

export type ReqApiRes<T> = {
  code?: number
  data?: T
  status?: number
  msgTimeout?: number
  msg?: string
  message?: string
  error?: any
  errors?: any
  [key: string]: any
}

export type ReqConfig = {
  domains: { [domain: string]: string }
  isRelease?: boolean
}
