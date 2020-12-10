---
id: concepts
title: 主要概念
---

了解 Ovine 应用的几个概念， 会对使用 `Json Schema` 开发 Admin 系统有大体印象，也会有整体开发思路

> 开始之前请先阅读 [目录结构](/org/docs/guides/start#目录结构)，如果已经阅读可忽略

## 渲染器

这是 Amis 提出的概念。渲染器就是用`Json Schema`渲染为真实 UI 的组件。 大家可以参考 [Amis 官方文档](https://baidu.github.io/amis/docs/components/page) 进行体验。所有的例子都是可以实时编辑并渲染的。动手编辑一下看看效果。

由例子可以看出

- 定义好的渲染器，可以根据 Json 渲染出对应的 UI
- 渲染器越多越强大便可以配置出各种各样的 UI 页面。
  - [Amis 渲染器列表](https://baidu.github.io/amis/docs/components/page)
  - [Amis Demo](https://baidu.github.io/amis/examples/pages/simple)
  - [Ovine Demo](https://ovine.igroupes.com/demo/)

这也是 Ovine 的最主要的核心概念。就是应用渲染器，结合 Webpack 与 React 集成为一个开箱即用的框架。也就是说，Ovine 只是做了上层的应用，本质还是封装了 Amis 的渲染器。

## Ovine 编译配置

```js title="/ovine.config.js 编译配置文件"
module.exports = {
  favicon: '/static/images/favicon.ico', // 站点 icon
  title: 'Ovine管理系统', // 站点 title
  publicPath: '/demo/', // 所有的资源文件前缀
  envModes: ['localhost', 'staging', 'production'], // env环境列表
}
```

:::info 特别强调

1. 此文件是在 Node 端运行，因此不能使用 es6 模块方法，请使用 CommonJS 规范。
2. 在 dev 开发时，每次 `ovine.config.js` 文件变更都将重新运行 `devServer`。请确保编辑没有错误才保存文件，否则会报错。

:::

这是应用的编译配置文件，能够对 Webpack 编译进行自定义控制。Ovine 对 Webpack 开发工具做了二次封装。[查看详细编译配置](https://ovine.igroupes.com/org/docs/advance/configurations#%E7%BC%96%E8%AF%91%E9%85%8D%E7%BD%AE)

## Ovine 应用配置

```js title="/src/index.js 应用配置文件"
export default {
  env: {}, // 环境变量配置
  entry: [], // 应用入口配置
  // 非必须选项
  constants: {}, // 覆盖内置常量
  amis: {}, // 覆盖内置 Amis 配置
  theme: new AppTheme(), // 主题实例
  request: new Request(), // 请求实例
}
```

Ovine 是以 Json 格式为基础，因此项目入口文件也是一个巨大配置结构，将 App 所有需要内容全部配置好，其他的任何页面或者组件中，将可以使用配置的内容。[查看详细应用配置](https://ovine.igroupes.com/org/docs/advance/configurations#%E5%BA%94%E7%94%A8%E9%85%8D%E7%BD%AE)

## 路由配置

```js
const routes = [
  {
    label: '根节点',
    nodePath: '/', // 节点路径
    children: [
      {
        label: '示例页面', // 节点的名称
        nodePath: '/blog', // 节点路径
        icon: 'fa fa-code', // 侧边栏Icon
        sideVisible: true, // 侧边栏可见性
        limitOnly: false, // 不渲染为路由，只用作权限
      },
    ],
  },
]
```

路由是一个树结构的配置。通过路由配置，可以组织整个应用的侧边导航、权限，是整个应用的基本配置之一。[查看详细路由配置](https://ovine.igroupes.com/org/docs/advance/configurations#%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE)

路由的配置主要有以下作用

- 分析出页面的路由，并将其渲染为侧边栏导航
- 权限是按照页面进行设置的，页面又是路由渲染出来的。因此路由渲染页面时，将的权限信息，注入页面中。这是整个应用实现权限控制的关键。

## 页面配置

:::info 特别强调
所有的路由页面必须再 `/src/pages/` 目录下。因为内置了，代码懒加载， 文件分割、和路由匹配、都是以 pages 目录进行的。这是项目约束写死的，不能随便更改此目录，或者将其删除。
:::

> 以下按 `blog` 页面举例。都是最简单的实例，主要是为了说明问题，而不是不是实际应用，实际场景可能会非常复杂。

### index.js 入口文件

```js title="src/pages/blog/index.js 博客页面入口"
export default {
  type: 'page',  // 页面渲染器
  title: '示例页面标题', // 页面标题
  css: `background: red;`, // 页面样式
  body: {
    type: 'button-toolbar', // 按钮组 渲染器
    className: 'm-b',
    buttons: [
      '$preset.actions.add', // 引用 preset.actions.add 配置
      {
        $preset: 'actions.edit', // 引用 preset.actions.edit 配置
      },
    ],
  },
  definitions: { // Amis definitions 定义
    updateControls: { // 定义好可供 $ref 引用的自字段
      controls: [{ // 输入框配置
         {
          type: 'text',
          name: 'hello',
          label: '输入框1',
        }, {
          type: 'text',
          name: 'world',
          label: '输入框2',
        },
      }]
    }
  },
  preset: { // Ovine 扩展的 预设字段，声明在这里的配置可以被引用
    actions: { // actions 操作
      add: { // 添加操作
        type: 'button',
        label: '添加',
        actionType: 'dialog',
        limits: 'add', // 需要添加权限才能看到，在 preset.js 中的 limits 字段定义好的
        dialog: {
          title: '添加弹窗',
          body: '$preset.forms.update' // 引用 preset.forms.update 配置
        },
      },
      edit: {  // 编辑操作
        type: 'button',
        label: '编辑',
        actionType: 'dialog',
        dialog: {
          title: '编辑弹窗',
          body: '$preset.forms.update'  // 引用 preset.forms.update 配置
        },
      },
    },
    forms: { // forms 表单
      update: {
        type: 'form', // 表单渲染器
        $ref: 'updateControls', // 引用 definitions.updateControls 字段
        api: '$preset.api.add' // 引用 preset.apis.add 配置
      }
    },

    // 拆分到 preset.js 中配置
    apis: {}, //页面所有用到的 api
    limits: {} // 页面所有用到的权限设置
  },
}
```

这是一个页面的唯一入口文件，可以是页面级别的渲染器 或者 [自定义页面组件](https://ovine.igroupes.com/org/docs/advance/custom#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E6%B8%B2%E6%9F%93%E5%99%A8)，此处只考虑页面渲染器。

**页面配置文件的一些特殊字段**

- #### `css` 样式配置

样式配置实际是，`lib-css` 渲染器的一个封装。可以配置简单的 css 字符串。或者使用函数， `` (theme) => `color: ${theme.colors.text}` ``。使用主题变量来编写样式。[查看 lib-css 渲染器](/org/docs/advance/renderers#lib-css)

- #### `definitions` 引用配置

definitions 是 Amis 官方的一种使用方式。可以定义公用配置，或者做嵌套渲染，使用 `$ref`引用，Ovine 没有做任何修改。[查看 Amis definitions 文档](https://baidu.github.io/amis/docs/components/Definitions)

- #### `preset` 预设配置

定义一些预设值，可供 Json 引用,这种用法和 definitions 用法很像，但是这两处的作用不一样。

- `definitions` 是将公共配置定义出来，用 `$ref` 引用
- `preset` 也是一些特殊的配置定义出来统一配置。
  - `actions` 页面内的需要操作的内容
  - `forms` 页面内的表单
  - `apis` 页面内的需要请求的 ap
  - `limits` 页面内权限控制的的内容

> 如果页面存在权限管理需要将 `preset.apis,preset.limits` 拆分到 `preset.js` 文件中

### preset.js 预设文件

```js title="src/pages/blog/preset.js 博客页面预设文件"
export default {
  // limits 列表，此处的配置将在权限控制面板中展示
  limits: {
    // 页面路由权限  key 值，必须是 $page
    // highlight-next-line
    $page: {
      label: '浏览页面',
    },
    // 添加权限，key 值不限制
    add: {
      label: '添加',
    },
    // 添加权限，key 值不限制
    edit: {
      label: '编辑',
    },
  },
  // apis 的 key 值不限制， value 是 RequestOption
  apis: {
    // 添加接口
    add: {
      url: 'POST api/blog',
      limits: 'add', // 需要添加权限
    },
    // 添加接口
    edit: {
      url: 'PUT api/blog/$id',
      limits: 'edit', // 需要添加权限
    },
  },
}
```

:::info 强调提示
`preset.js` 不要引入其他依赖，尽量保持无引用。虽然不是强制，但是做到这点很重要。[查看原因](org/docs/guides/concepts#%E8%B7%AF%E7%94%B1%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84-preset-%E5%AD%97%E6%AE%B5-%E4%B8%8E-presetjs-%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB%EF%BC%9F)
:::

`preset.js` 只能配置 `limits、apis` 两个字段。 预设值文件，和路由配置一样，是项目权限控制实现的基础。这个文件就构成了 权限控制面板所有的权限选项。使用 `lib-limit-settiong` 渲染器，将选择好的权限，提交给后端。用户的权限修改后，将不能看到对应的操作。[查看权限控制详细文档](/org/docs/advance/limit)

### mock.js 模拟数据

```js title="src/pages/blog/mock.js 博客页面mock数据"
export default {
  // 对 'POST api/blog 接口产生MOCK数据
  'POST api/blog': (source) => {
    // 可以获取请求所有参数，并进行自定义数据返回
    return {
      code: 0, // 正确返回 mock
      data: {
        // 一堆正确数据
      },
    }
  },
  // 对 编辑 接口数据 MOCK
  'PUT api/blog/$id': () => {
    return {
      code: 1000, // 错误返回 mock
    }
  },
}
```

开启 mock 后，接口将不会访问服务端，而是直接返回 mock.js 文件中对应接口的数据。这是应用中 mock 数据方法之一。 [查看 mock 详细文档](/org/docs/advance/mock)

### 路由页面中的 .preset 字段 与 preset.js 有什么区别？

- `preset.js` 中配置的 `limits、apis` 字段，渲染时会被注入到页面的 `.preset` 配置中
- `.preset` 字段其实是由 `actions、forms、apis、limits` 四个字段组成，只是 `limits、apis` 被拆分到 `preset.js` 中去了

**为什么要拆分为两个文件，而不是都放在页面配置文件中？**

因为权限校验是抽取应用整个权限设置数据，来一一匹配。因此会将所有页面的权限信息，import 到一起做处理。如果将权限信息放在页面配置中，在进行权限匹配时，就会将所有页面代码 import 到一起。应用将不能按照路由做文件拆分、代码分割。

将 preset.js 从页面配置中拆出来，那么权限校验时，只会引入对应 preset.js 中的代码，而不需要页面具体的配置代码。因此保证 preset.js 无任何 import 代码，将能够减少页面首次加载 js 包的大小。特别是当页面上百个页面之后，更加明显。
