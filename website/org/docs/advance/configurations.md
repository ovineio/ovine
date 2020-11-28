---
id: configurations
title: 配置一览表
---

这里列举了项目主要需要配置详细内容和描述。

## 编译配置

```ts title="/ovine.config.js Ovine编译配置"
export type SiteConfig = {
  // highlight-start
  favicon: string // 项目 icon，必须配置
  title: string // 项目 title，必须配置
  // highlight-end
  publicPath: string // 项目的静态资源前缀路径，可用于CDN部署，修改后需要重新执行 `yarn dll`
  devServerProxy: any // devServer的代理设置，与 webpack dev server proxy 配置一致。文档 https://webpack.docschina.org/configuration/dev-server/#devserverproxy
  envModes?: string[] // 应用环境列表
  initTheme?: string // 初始化主题
  staticFileExts?: string[] // 需要处理的静态资源类型
  // 按路由路由分割代码， 默认不分割代码，
  splitRoutes?: Array<{
    test: RegExp // 路由正则匹配
    name: string // 被匹配的路由，将分割为一个文件
  }>
  template?: {
    // 页面模版文件配置
    head?: string // 嵌入 <head> 标签的内容
    preBody?: string // 嵌入 <body> 标签最上面
    postBody?: string // 嵌入 <head> 标签最下面
  }
}
```

:::info 特别强调

1. 此文件是在 Node 端运行，因此不能使用 es6 模块方法，请使用 CommonJS 规范。
2. 在 dev 开发时，每次 `ovine.config.js` 文件变更都将重新运行 `devServer`。请确保编辑没有错误才保存文件，否则会报错。
3. `publicPath` 修改后需要重新执行 `yarn dll`

:::

## 应用配置

```ts title="/src/index.js Ovine应用配置"
// 应用入口配置
export type AppConfig = {
  // highlight-start
  env: EnvConfig // 应用环境变量，必须配置
  entry: any[] // APP应用入口，必须配置
  // highlight-end
  amis?: RenderOptions & {
    // Amis 的渲染配置
    definitions?: any
  }
  request?: Request // 请求模块配置
  theme?: AppTheme // 主题模块配置
  styled?: {
    // 样式相关的配置
    globalStyle?: string | ((theme: DefaultTheme) => any) // 全局样式
  }
  constants?: {
    // 覆盖内置常量
    pathPrefix?: string // 页面基础路径，默认与 publicPath 一样，也可以单独设置
    rootLimitFlag?: string // 超级管理员权限标示。存在这个标示，将默认不校验任何权限
    enableBackTop: boolean // 是否开启 “快速回到顶部” 功能
    notFound?: {
      // 404 页面
      route?: string // 默认跳转 404
      pagePath?: string // 404 页面文件
    }
    toastDuration?: number // Toast 提示持续时间
    loginRoute?: string // 登录路由
  }
  hook: {
    // 可以实现动态控制配置，非常灵活
    beforeCreate?: (app: any, config: AppConfig) => Promise<void> // 创建 App 之前的回调
    afterCreated?: (app: any, config: AppConfig) => Promise<void> // 创建 App 之后的 回调
    onAppMounted?: () => void // App 被挂载之后回调
  }
}

// 环境配置
type Env = {
  mode: string // 当前环境标示
  domains: Map<string, string> // 所有的域名
  disableLimit?: boolean // 是否开启权限校验
  isRelease?: boolean // 是否 release 环境
  isProd?: boolean // 是否是 production 环境
  // 日志打印配置
  logger?: {
    level: 'log' | 'info' | 'warn' | 'error'
    moduleName: string
  }
}

// 不同环境配置
export type EnvConfig = {
  default: Env // 默认选项
  [env: string]: DeepPartial<Env> // 不同环境不同的配置
}
```

## 路由配置

路由配置是一个树状结构数据。`children` 字段可以无限嵌套。由于权限是和路由紧密结合的，因此路由配置中有很多跟权限相关的配置。虽然配置项非常多，但是经常会用到的会很少。

```ts
export type RouteItem = {
  nodePath: string // 节点路径
  label: string // 节点显示名称
  icon?: string // 节点 icon
  path?: string // 真实页面路由
  pathToComponent?: boolean | string // 路由对应 pages 文件目录下本地路径 或者 远程页面。比如 https://xxx, http://xxx, root://xxx
  sideVisible?: boolean // 侧边栏是否可见
  limitOnly?: boolean // 该节点仅仅用于权限配置，不需要渲染路由
  limitLabel?: string // 权限label，在权限面板中展示
  className?: string // 节点的样式
  children?: RouteItem[]

  hidden?: boolean // 隐藏该节点
  open?: boolean // 打开该节点
  active?: boolean // 选中状态
  component?: React.Component // 路由节点组件（非懒加载路由）
  exact?: boolean // 完全匹配路由
  sensitive?: boolean // 是否大小写敏感
  strict?: boolean // 是否校验末尾 “/”

  nodeLabel?: string // 节点面包屑 label
  badge?: number // 侧边栏提示数字
  badgeClassName?: string // 侧边栏提示数字样式
  // 用于该节点为权限配置，当 limitOnly 为 true 可以配置权限信息
  limits?: {
    // 与 preset.js 中 limits 一致
    [limit: string]: {
      label: string
      icon?: string
      needs?: string[]
      desc?: string
    }
  }
  apis?: {
    // 与 preset.js 中 apis 一致
    [api: string]: ReqOption
  }
}
```

:::info 特别强调
`nodePath` 非常重要，因为路由配置是树状结构，因此真实的页面路由是 当前节点的 nodePath，与其祖先节点的 nodePath 拼接而成 routePath。就会按照拼接好的路径去，在 `/src/pages/routePath` 目录下找对应的文件。如果能找到则正常渲染，找不到文件则会报错。
:::

举例说明 routePath 生成规则

```js
const routeConfig = [
  {
    nodePath: '/',
    children: [
      {
        nodePath: 'a',
        children: [
          {
            nodePath: 'b',
            children: [
              {
                nodePath: 'c',
                label: 'C页面',
              },
            ],
          },
        ],
      },
    ],
  },
]
```

那么最终 `C页面` 的路径为 `/a/b/c`, 就会自动去 `/src/pages/a/b/c` 目录去找 `index.js` 文件，如果找到了则正常渲染，找不到则报错文件找不到。无法正常渲染页面。

## preset 预设置配置

> 如果不知道 `preset` 是什么？[请点击查看](/org/docs/guides/concepts#presetjs-%E9%A2%84%E8%AE%BE%E6%96%87%E4%BB%B6)

```ts
export type SchemaPreset = {
  // 页面所有权限定义
  limits?: {
    [limit: string]: {
      label: string // 权限标签
      icon?: string // 权限icon
      needs?: string[] // 定义权限依赖
      desc?: string // 权限描述
    }
  }
  // 页面内所有异步请求
  apis?: {
    [api: string]: ReqOption & {
      key?: string // 设置后后端接口就按照key来判断权限
      limits?: string | string[] // 接口需要的权限
      // 权限运算逻辑，limits 中所有列举的接口，and，全部满足，or 满足一个即可
      limitsLogic?: 'and' | 'or'
    }
  }
  // 所有操作列表
  actions?: {
    [action: string]: Schema // Amis Action 渲染器
  }
  // 所有的表单
  forms?: {
    [form: string]: Schema // Amis from 渲染器
  }
}
```

**查看关联资源**

- [ReqOption 类型](/org/docs/modules/request#reqoption-%E9%80%89%E9%A1%B9)
- [Amis Action 渲染器](https://baidu.github.io/amis/docs/components/action)
- [Amis from 渲染器](https://baidu.github.io/amis/docs/components/form/index)
