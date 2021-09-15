---
id: route
title: 路由跳转
---

### 关于路由

Ovine 内置了简单的路由逻辑，只实现了 [`BrowserHistory`](https://blog.51cto.com/xhtml/1945928)，不支持 `HashHistory`。新添加页面，只需要在应用配置的中 `entry` 中传入路由页面，或者在 `aside-layout.routes` 中传入侧边栏路由页面，就可以直接进行页面跳转了。

> BrowserHistory 是目前单页面应用普遍采取的方案，但项目部署有一些有简单要求。[部署文档](https://ovine.igroupes.com/org/docs/advance/cli/#%E9%83%A8%E7%BD%B2-ovine-%E5%BA%94%E7%94%A8)

- ##### 通过 Ovine 应用配置 `entry` 添加页面。[完整应用配置](/org/docs/advance/configurations#%E5%BA%94%E7%94%A8%E9%85%8D%E7%BD%AE)

```js
const appConfig = {
  //...其他配置
  entry: [
    // 这里可以配置任何页面
    {
      type: 'preset-route', // 路由组件
      path: '/login', // 登陆页面
      pathToComponent: true, // true 表示， 这页面的源文件在 `/src/pages/login/index`
    },
    {
      type: 'preset-route', // 路由组件
      path: '/custom_page', // 任何其他页面，可实现很多其他应用
      pathToComponent: true, // true 表示， 这页面的源文件在 `/src/pages/custom_page/index`
    },
    {
      type: 'private-route', // 鉴权路由
      path: '/', // 根页面鉴权
      redirect: '/login', // 鉴权失败跳转页面
      onAuth: () => true, //  每次页面鉴权 需要调用的认证方法，此处可以读取接口，和设置权限等。
      children: {
        type: 'aside-layout', // 鉴权成功后需要渲染的布局组件
        // 布局切换路由页面
        routes: [],
      },
    },
  ],
}
```

- [`aside-layout`](/org/docs/advance/renderers#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE%E4%B8%AD-entry-%E4%B8%AD%E5%8F%AF%E9%85%8D%E7%BD%AE%E7%9A%84%E6%B8%B2%E6%9F%93%E5%99%A8) 布局内页面

```js
const layoutConfig = {
  // ...其他配置
  type: 'aside-layout', // 鉴权成功后需要渲染的布局组件
  // 布局切换路由页面
  routes: [
    // 这里可以配置权限 或者 页面路由
    {
      nodePath: '/',
      limitLabel: '侧边栏目录',
      label: '',
      children: [
        {
          path: '/',
          label: 'Dashboard',
          nodePath: 'dashboard',
          exact: true,
          pathToComponent: 'dashboard', // 表示，这页面的源文件在 `/src/pages/dashboard/index`
          sideVisible: false, // 不会显示在侧边栏
        },
        {
          label: 'DEMO应用',
          icon: 'fa fa-paint-brush',
          nodePath: 'application',
          children: [
            {
              // 对应路由为 /application/hot
              label: '热更新管理',
              nodePath: 'hot', // 对应源文件 src/pages/application/hot
            },
            {
              // 对应路由为 /application/hot
              label: '文档管理',
              nodePath: 'doc', // 对应源文件 src/pages/application/doc
            },
          ],
        },
      ],
    },
  ],
}
```

### 路由跳转

- ##### 在 JS 逻辑中进行页面跳转. [History Api 文档](https://github.com/ReactTraining/history/tree/v4.7.2)

```js
import { app } from '@ovine/core/app'
// 具体其他的使用方式，可以参照 History Api 文档
app.routerHistory.push('/application/hot') // 跳转到指定页面
app.routerHistory.goBack() // 回退到上个页面

// 如果是想跳转到非本站页面，请使用 window.open(xxx) 或者 location.href=xxx
```

- #### 使用 Action 渲染器， 在 JSON 中实现页面跳转。[Amis 文档地址](https://baidu.gitee.io/amis/zh-CN/docs/components/action#%E5%8D%95%E9%A1%B5%E8%B7%B3%E8%BD%AC)

```js
// 单页跳转, 就是本站内跳转，不会再次重新渲染
const json = {
  type: 'page',
  body: {
    label: '进入介绍页',
    type: 'action',
    actionType: 'link', // 单页跳转
    blank: false, // 是否新开窗口
    level: 'info',
    link: '/page/path', //需要跳转的项目链接
  },
}

// 直接跳转，就是相当于普通 a 标签跳转
const json = {
  type: 'page',
  body: {
    label: '打开 Ovine 文档',
    type: 'action',
    actionType: 'url', // 直接跳转
    level: 'success',
    blank: true, // 是否新开窗口
    url: 'https://ovine.igroupes.com/org/',
  },
}
```
