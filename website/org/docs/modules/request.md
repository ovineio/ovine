---
id: request
title: 请求模块
---

请求模块是二次封装 [fetch](https://github.com/github/fetch) 模块。既支持对请求的各个阶段可以添加 hooks 回调 `(对Json配置更友好)`，也支持 `promise` 方式链式调用。

### Request 类

请求实例添加的 hooks. 将在全局每一个接口请求中被调用。

```typescript
import { Request } from '@core/utils/request'

// 全局请求实例
const reqInstance = new Request()

// 设置请求实例, Ovine 内置了此步骤，不需要自行设置
reqInstance.setConfig({
  domains: {
    api: 'https://site-api.com', // 设置请求域名
  },
  isRelease: false, // 是否为线上环境，为 true 时，会禁用 mock 数据
})

// 请求发起前的回调,
reqInstance.onPreRequest = (option: ReqOption): ReqOption => {
  // 此处可以进行一系列请求拦截，并返回新的参数

  // 举例，默认全局开启或者关闭 mock
  option.mock = true // true 开启 mock， false 关闭  mock

  // 返回处理后的参数
  return option
}

// 发送请求时的回调，此回调会在 onPreRequest 之后
reqInstance.onRequest = (option: ReqOption): ReqOption => {
  // 此时的 option 参数，是 fetch 直接请求的参数。

  // 举例： 添加参数在请求header中
  const { headers = {} } = option
  headers['X-ARG'] = 'some data'
  option.headers = headers

  // 返回处理后的参数
  return option
}

// 请求成功回调，对请求成功返回进行统一的拦截
reqInstance.onSuccess = (data: any, option: ReqOption, response: ReqResponse): any => {
  // amis 接口数据格式要求 https://baidu.gitee.io/amis/zh-CN/docs/types/api
  // 举例 接口返回值 封装为 amis 要求的结构
  const { code = 0, msg, message } = data // 接口返回的JSON数据

  const apiRes = {
    // amis 要求的数据格式
    ...data,
    status: code,
    msg: msg || message,
  }

  // 返回处理过的数据
  return apiRes
}

// 请求失败的回调，没有返回值
reqInstance.onError = (response: ReqResponse, option: ReqOption, error: Error): void => {
  // 可以在此处打印错误请求日志，或者做全局请求错误提示
}

// 请求完成之后回调，无论成功失败都会调用，没有返回值
reqInstance.onFinish = (response: ReqResponse, option: ReqOption, error?: Error): void => {
  // 可以在此处做一些记录
}

export default reqInstance
```

### ReqOption 选项

在所有页面配置中 `api` 字段配置中可以使用

> URL 格式 `GET xxx/xxx` 请求方法大写 + 空格 + api 地址

```ts
// 请求方法类型
export type ReqMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type ReqOption<S = {}, P = {}> = {
  api?: string // 请求原始api字符串
  url?: string // 默认与 api 一样
  method?: ReqMethod // 默认都是放在URL中，不需要单独写。默认 GET
  domain?: string // '请求的域名key， 默认 api'
  data?: Partial<P> // 请求数据
  headers?: any // 请求头
  body?: BodyInit | null // 请求体
  dataType?: 'json' | 'form-data' | 'form' // 请求体类型
  responseType?: 'blob' // 返回 blob 下载文件
  expired?: number // 超时时间内的相同请求，会使用缓存数据。毫秒数，默认0
  cache?: number // 前置缓存适用于并发请求
  qsOptions?: QsOptions // 用于处理参数转为字符串。具体定义查看下方 QsOptions
  fetchOptions?: FetchOptions // fetch参数。具体定义查看下方 FetchOptions
  actionAddr?: string // 操作地址，不存在时默认为 api
  actionDesc?: string // 操作描述文案 与操作地址对应
  isEnvFetcher?: boolean // 是否是 amis env 发起的请求
  mock?: boolean // 是否启用 mock
  mockSource?: object | ((options: ReqOption) => object) // mock数据生成器
  mockDelay?: number // mock数据延迟 默认 300
  onUploadProgress?: (event: { loaded: number; total: number }) => void // 上传进度回调
  // 以下回调函数支持字符串的形式函数体
  onFakeRequest?: (option: ReqOption) => S | Promise<S> // 伪装请求，不会真请求，返回的内容将直接返回
  onPreRequest?: (option: ReqOption) => ReqOption // 发起请求回调
  onRequest?: (option: ReqOption) => ReqOption // 请求时回调
  onSuccess?: (data: S, option: ReqOption<S, P>, response: ReqResponse<S>) => S // 接口请求成功回调
  onError?: (response: ReqApiRes<S>, option: ReqOption<S, P>, error: Error) => undefined | boolean // 接口请求失败回调
  [key: string]: any // 自定义扩展字段
}
```

### 与 [Amis Api 选项](https://baidu.gitee.io/amis/zh-CN/docs/types/api#%E5%B1%9E%E6%80%A7%E8%A1%A8) 的区别

注意：Ovine 使用 `fetch` 作为请求库，并未使用 `axios`，因此不能使用 `axios` 很多额外功能。

```ts
// amis 请求选项
type ApiObject = {
  // 特别说明： 必须传入 Ovine 请求URL格式。 `GET XXX/xx` 或者 `POST xxx/xx` 等
  url: string // 请求  api 地址
  // 特别说明： Ovine 请求方法都是大写，url 按照格式写，就不需要传这个参数
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' // 请求方法
  data?: object // 数据体, 数据对象。
  headers?: any // 请求头
  reload?: string // 是否刷新页面
  sendOn?: string // 可以配置发送条件比如： this.id 表示当存在 id 值时才发送这个请求。
  dataType?: 'json' | 'form-data' | 'form' // （multipart/form-data） 格式。当配置为 form 时为 application/x-www-form-urlencoded 格式
  qsOptions?: QsOptions // 数据转换为字符串时的选项
  replaceData?: boolean // 返回的数据是否替换掉当前的数据，默认为 false，即：追加，设置成 true 就是完全替换
  config?: {
    onUploadProgress?: (event: { loaded: number; total: number }) => void // 上传文件进度回调
    cancelExecutor?: (cancel: Function) => void // 取消请求的回调
    withCredentials?: boolean // 是否携带 token
  }

  /**
   * Ovine 不支持 Amis 以下参数，主要是因为功能重叠了
   */
  // requestAdaptor 请使用 onPreRequest 或者 onRequest  代替
  requestAdaptor?: (api: ApiObject) => ApiObject
  // adaptor 请使用 onSuccess 代替
  adaptor?: (payload: object, response: fetcherResult, api: ApiObject) => any
}
```

### request 模块的应用

#### 配置 requestInstance

```js title="/src/app.auto.js Ovine入口文件"
import { Request } from '@core/utils/request'

const reqInstance = new Request()

// 按照需求 添加 hooks
reqInstance.onPreRequest = () => {} // 添加用户登录鉴权等操作
reqInstance.onSuccess = () => {} // 对返回结果统一处理
reqInstance.onError = () => {} // 可对错误请求统一处理

export default {
  env: {}, // 环境配置
  entry: {}, // 应用入口
  // highlight-next-line
  request: reqInstance, // 配置自定义请求
}
```

#### 在 Json 配置中应用

- 有 api 的地方均可使用 ReqOption 选项
- `preset.js` 文件 `apis` 字段配置中，可使用 ReqOption 选项

#### 在 Js 逻辑中应用

在项目任何地方都可以使用 `app.request` 来请求数据。参数是 `ReqOption`

```js
import { app } from '@core/app'

app
  .request({
    url: 'POST user/login',
    data: {
      username: '123',
      password: 'abc',
    },
  })
  .then((source) => {
    if (source.code !== 0) {
      console.log('登录失败')
      return
    }
    console.log('登录成功')
  })
  .catch(() => {
    console.log('请求发生异常')
  })
```

### `ReqOption` 关联参数选项

#### `FetchOptions` 选项

可自定义的部分 fetch 参数。[查看 fetch 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)

```ts
type FetchOptions = {
  cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload'
  credentials?: 'include' | 'omit' | 'same-origin'
  integrity?: string
  keepalive?: boolean
  mode?: 'cors' | 'navigate' | 'no-cors' | 'same-origin'
  redirect?: 'error' | 'follow' | 'manual'
  referrer?: string
  referrerPolicy?:
    | ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url'
  window?: any
}
```

#### `QsOptions` 选项

qs 模块 stringify 方法参数。[查看 qs 模块文档](https://github.com/ljharb/qs)

```ts
/*
默认值: {
  arrayFormat: 'indices',
  encodeValuesOnly: true
}
*/
type QsOptions = {
  delimiter?: string
  strictNullHandling?: boolean
  skipNulls?: boolean
  encode?: boolean
  encoder?: (
    str: any,
    defaultEncoder: defaultEncoder,
    charset: string,
    type: 'key' | 'value'
  ) => string
  filter?: Array<string | number> | ((prefix: string, value: any) => any)
  arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma'
  indices?: boolean
  sort?: (a: any, b: any) => number
  serializeDate?: (d: Date) => string
  format?: 'RFC1738' | 'RFC3986'
  encodeValuesOnly?: boolean
  addQueryPrefix?: boolean
  allowDots?: boolean
  charset?: 'utf-8' | 'iso-8859-1'
  charsetSentinel?: boolean
}
```
