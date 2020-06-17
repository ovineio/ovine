---
id: request
title: 请求模块
---

请求模块是二次封装 [fetch](https://github.com/github/fetch) 模块。对请求的各个阶段可以添加 hooks 回调。

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
  // amis 接口数据格式要求 https://baidu.github.io/amis/docs/api#%E6%95%B4%E4%BD%93%E6%A0%BC%E5%BC%8F
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
  data?: Partial<P> // q请求数据
  headers?: any // 请求头
  body?: BodyInit | null // 请求体
  contentType?: 'json' | 'form-data' | 'form' // 请求体类型
  token?: 'none' | 'auto' | 'force' // 是否需要token 标示。
  expired?: number // 超时时间内的相同请求，会使用缓存数据。毫秒数，默认0
  fetchOptions?: Omit<RequestInit, 'header' | 'body'> // fetch参数
  mock?: boolean // 是否启用 mock
  mockSource?: ReqMockSourceGen // mock数据生成器
  mockDelay?: number // mock数据延迟 默认 300
  actionAddr?: string // 操作地址，不存在时默认为 api
  actionDesc?: string // 操作描述文案 与操作地址对应
  isEnvFetcher?: boolean // 是否是 amis env 发起的请求
  onUploadProgress?: (event: { loaded: number; total: number }) => void // 上传进度回调
  onPreRequest?: (option: ReqOption) => ReqOption // 发起请求回调
  onRequest?: (option: ReqOption) => ReqOption // 请求时回调
  onSuccess?: (data: S, option: ReqOption<S, P>, response: ReqResponse<S>) => S // 接口请求成功回调
  onError?: (response: ReqApiRes<S>, option: ReqOption<S, P>, error: Error) => undefined | boolean // 接口请求失败回调
  [key: string]: any // 自定义扩展字段
}
```

### request 模块的应用

#### 配置 requestInstance

```js title="/src/index.js Ovine入口文件"
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

#### 在页面配置 Json 中应用

```js
// 有 api 的地方均可使用 ReqOption 选项

// preset.js 文件中
```

#### 在逻辑 Js 中应用

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
