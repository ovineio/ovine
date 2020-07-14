---
id: custom
title: 自定义扩展
---

## 自定义页面

`Json 配置页面`是经过特殊封装后的页面，而`自定义页`需要自己手动写 React 组件代码。

```js title="/src/pages/custom/index.js"
import React from 'react'

export default () => {
  return <div>你可以在自定义页面中可按照React方式做任何事</div>
}
```

## 自定义组件/渲染器

在 Ovine 中自定义组件，和 React 自定义组件一样，没有任何区别。

#### 自定义复杂的渲染器

请参考 [Amis 官方文档](https://baidu.github.io/amis/docs/sdk)自定义比较复杂的渲染器，Ovine 没有额外任何处理。

### 多个页面公用相同的 Json 配置

- 设置公用 Json 配置

  ```js title="/src/index.js Ovine入口配置"
  export default {
    // highlight-start
    amis: {
      // 这个配置就是全局公用Json的一种方式
      definitions: {
        // highlight-end
        // key/value 值随意自定义
        commonForm: {
          title: '你好',
        },
        commonAction: {
          //
        },
        // 支持纯方法转换，对于某些需要全局Json转换的场景
        commonInput: (conf) => {
          // conf 参数就是当前节点的配置
          return {
            type: 'text',
            label: conf.label,
          }
        },
      },
    },
  }
  ```

- 在任何其他 Json 配置页面可引用

  ```js title="/src/pages/xxx/index.js"
  export default {
    type: 'page',
    body: {
      type: 'wrapper',
      body: [
        {
          // highlight-next-line
          $ref: 'commonForm', // 引用设置好的  commonForm 配置
          title: '你好吗？', // 可覆盖公共 commonForm 配置中的字段
        },
        {
          $ref: 'commonInput', // 引用 commonInput
          label: '测试',
        },
      ],
    },
  }
  ```

### 使用 `lib-renderer` 自定义简单渲染器

简单渲染器就是指，该渲染器只需啊哟简单逻辑处理，将一些简单的 Json 参数，封装为比较复杂的 Json 参数。特别是某些信息弹窗，需要很长的配置。

> 注意：1. 不支持 `formItem` 渲染器。 2. 定义代码一定要被引入项目中才能生效。

- 添加渲染器

  ```js
  import { addLibRenderer } from '@core/components/amis/lib_renderer'

  addLibRenderer('sysUserInfoModal', (userId) => {
    return {
      type: 'action',
      level: 'link',
      className: 'no-shadow',
      label: `${userId}`,
      actionType: 'dialog',
      dialog: {
        title: '系统用户信息',
        actions: [],
        closeOnEsc: true,
        body: {
          type: 'service',
          api: 'GET api/user/info',
          body: {
            type: 'form',
            wrapWithPanel: false,
            mode: 'horizontal',
            controls: [
              {
                name: 'nickname',
                label: '名称',
                type: 'html',
                html: '<span>${nickname} (${id})</span>',
              },
              {
                type: 'static',
                name: 'signature',
                label: '个性签名',
              },
            ],
          },
        },
      },
    }
  })
  ```

- 使用渲染器

  ```js
  export default {
    type: 'page',
    body: {
      type: 'wrapper',
      body: {
        // 使用很简单的配置，便可以引用很长的配置项
        // highlight-start
        type: 'lib-renderer',
        renderer: 'sysUserInfoModal',
        userId: 123,
        // highlight-end
      },
    },
  }
  ```
