---
id: request
title: 请求模块
---

请求模块是二次封装 [fetch](https://github.com/github/fetch) 模块。对请求的各个阶段可以添加 hooks 回调。

### Request 类

请求实例添加的 hooks. 将在全局每一个接口请求中被调用。

```js
import { Request } from '@core/utils/request'

// 全局请求实例
const reqInstance = new Request()

// 设置请求实例
reqInstance.setConfig({
  domains: {
    api: 'xxx',
  },
  isRelease: false,
})

// 请求发起前的回调
reqInstance.onPreRequest = () => {
  //
}

// 发送请求时的回调
reqInstance.onRequest = () => {
  //
}

// 请求成功回调
reqInstance.onSuccess = () => {
  //
}

// 请求失败的回调
reqInstance.onError = () => {
  //
}

// 请求完成之后回调
reqInstance.onFinish = () => {
  //
}

export default reqInstance
```

### ReqOption 选项

在所有页面配置中 `api` 字段配置中可以使用

```ts
export type ReqOption<S = {}, P = {}> = {
  api?: string // 请求原始 api 字符串
  url?: string // 默认与 api 一样
  method?: ReqMethod // 请求方法
  domain?: string // 请求api域名
  data?: Partial<P> // 请求参数
  headers?: HeadersInit // 请求 header
  body?: BodyInit | null // 请求的 body,主要用文件上传
  json?: boolean // 是否是 json 数据返回
  qsOptions?: object // get请求对于queryString参数的处理选项
  token?: 'none' | 'auto' | 'force' // 是否需要 token
  sourceKey?: string // 返回数据字段路径
  expired?: number // 请求过期时间
  fetchOption?: Omit<RequestInit, 'header' | 'body'> // fetch 参数
  mock?: boolean // 是否启用 mock
  mockSource?: ReqMockSourceGen // mock数据生成器
  mockDelay?: number // mock数据请求延迟时间
  actionAddr?: string // 操作地址，不存在时默认为和api一致
  onPreRequest?: (option: ReqOption) => ReqOption // 请求发起时的回调
  onRequest?: (option: ReqUnionOption) => ReqUnionOption // 发送请求时的回调
  onSuccess?: ReqSuccessHook<S, P> // 接口成功回调
  onError?: ReqErrorHook<S, P> // 接口失败回调
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
