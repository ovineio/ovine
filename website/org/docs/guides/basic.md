---
id: basic
title: 基本应用
---

这里介绍 Ovine 的基本应用相关的内容，主要是如何使用 Ovine 编译配置，配置页面，权限，表单等，可以快速上手。

> 开始之前请先阅读 Ovine [主要概念](/org/docs/guides/concepts)，如果已经阅读可忽略

**资源目录**

- [渲染器列表](/org/docs/advance/renderers)
- [配置列一览表](/org/docs/advance/configurations)

## 编译配置

```js title="/ovine.config.js 编译配置"
module.exports = {
  favicon: 'static/images/fav.ico', // 项目 icon，必须配置
  title: 'Amdin', // 项目 title，必须配置
  initTheme: 'default', // 初始化主题
}
```

## 应用配置

:::info 特别强调
这里为了简化把所有的配置写到一起了，实际应用中，可以按照任意代码组织的方式进行查拆分，最终导出一个完整的配置就好。
:::

> 不要复制此处的代码，这里只是做一些说明，并不能使用

```js title="/src/index.js Ovine应用配置"
export const schema = {
  // 应用环境变量，必须配置
  env: {
    // 默认配置
    default: {
      domains: {
        api: 'http:dev-site.com/api',
      },
    },
    // 本地环境
    localhost: {
      domains: {
        api: 'http:dev-site.com/api',
      },
    },
    // 测试环境
    staging: {
      domains: {
        api: 'http:staging-site.com/api',
      },
    },
    // 生产环境
    production: {
      domains: {
        api: 'http:site.com/api',
      },
    },
  },
  // APP应用入口，必须配置
  entry: [
    {
      type: 'preset-route', // 路由组件渲染器
      path: '/login', // 登录页面
      pathToComponent: true,
    },
    {
      type: 'private-route', // 私有路由渲染器
      path: '/',
      redirect: '/login', // 如果未授权，重定向到登录页面
      onAuth: async () => {
        // 登录鉴权, 可以在这里请求接口
        return true
      },
      children: {
        type: 'aside-layout', // 侧边栏布局渲染器
        header: {
          brand: {
            logo: '',
            title: '',
          },
        },
        items: [
          {
            type: 'item-dev-code', // 显示开发时的一些页面配置好
          },
          {
            type: 'item-setting', // 系统设置
            align: 'right',
          },
        ],
        // 需要授权的路由
        routes: [
          {
            nodePath: '/',
            limitLabel: '侧边栏目录', // 用于权限配置显示标签
            label: '',
            children: [
              {
                path: '/',
                label: 'Dashboard', // dashboard 页面
                nodePath: 'dashboard',
                exact: true,
                pathToComponent: 'dashboard',
                sideVisible: false,
              },
            ],
          },
        ],
      },
    },
  ],
}
```

这里为了简化不够详细，而且很多内容没有做过多说明，有一个大致印象就好。具体实际应用中，比这个示例要复杂很多，但是整体就是这样的一种方式来配置应用。

## 添加新页面

添加一个新页面需要固定以下步骤，实际上正常开发 Admin 系统步骤差不多，只不过所有的功能都由代码编写，转化为 Json 配置。可能刚开始还不适应，不过写上几个页面，找到了方法， 会快很多。而且 Json 可以很方便随意复制，相似的功能，可以快速复制而不需要每次从头开始写。另外，完全可以按照自己的需求，再封装一次，可以大大提高效率。

### 添加页面路由

任何页面的添加必须要先添加路由

> 路由配置放在 `aside-layout.routes` 这个字段中

### 添加页面配置

#### 必须: 添加 `index.js` 配置

#### 可选: 添加 `prest.js` 预设配置

#### 可选: 添加 `styled.js` 样式

#### 可选: 添加 `mock.js` Mock 数据
