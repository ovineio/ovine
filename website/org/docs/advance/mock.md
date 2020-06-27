---
id: mock
title: Mock 数据
---

## Mock 方案

Ovine 只是使用一种比较简单 Mock 方案，方便前端能够自定义数据。而不需要额外的服务器配合。

在 API 请求的时候，添加了一个 `mockSource`参数，如果在 Mock 环境中，并且传入了 `mockSource` 参数，那么 `request` 模块将不会请求服务数据，而是返回 `mockSouce` 生成的数据。

:::warning 特别强调
整个项目的任何目录下的 `mock.js` 都是被用做 Mock 数据用途，请不要使用 mock.js 编写任何业务逻辑。因为 mock.js 线上打包环境默认不会被引入。如果要强制在线上使用 mock 数据，需要在构建命令中使用 `ovine build --mock`
:::

## 路由页面 Mock 数据

> 如果不清楚 mock 与路由页面配置的关系，[请点击查看](/org/docs/guides/concepts#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE)

```js
// index.js
export default {
  type: 'page',
  body: {
    type: 'action',
    api: '$preset.api.add',
  },
  preset: {
    apis: {
      add: {
        mock: true,
        url: 'POST apu/add',
      },
    },
  },
}

// mock.js
export default {
  'GET api/list': () => {
    return {
      data: [
        {
          id: 1,
        },
      ],
    }
  },
  'POST api/add': () => {
    return {
      code: 0,
    }
  },
  'PUT api/edit': () => {
    return {
      code: 0,
    }
  },
}
```

## 非路由页面 Mock 数据

很多业务都是有 Js 编写，并不是在路由页面，则需要手动引入。

> 千万不要使用 `mockSource.xxx`，调用 mock.js 文件的属性，否则非 mock 环境中会报错。

```js

// mock.js
export default {
  'GET user/info': (source) => {
    // source 请求数据，可以根据请求参数模拟各种情况，但是需要手动写代码
    return {
      code: 0,
      data: [
        {
          id: 1,
        },
      ],
    }
  },
}

// user.js

import { app } from '@core/app'
import mockSource from './mock'

const getUserInfo = () => {
  return app.request({
    mockSource // 一定不要使用 mockSource.xxxx，否则非 mock 环境中会报错。
    mock: true, // 是否开启mock数据，可以灵活切换
    url: 'GET user/info',
  })
}

```
