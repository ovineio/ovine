---
id: limit
title: 权限控制
---

权限是一个管理系统的关键组成部分之一。使不同操作人员仅对自己职责范围内的相关内容进行管理，防止无关人员干扰。也可以保护企业机密信息不被泄漏。
Ovine 提供了尽可能的灵活方式在 UI 渲染层面的权限控制，并同时也对后端 API 权限控制提供了一个入口。

## 简单图示

:::info 提示
这里只是简单将 Ovine 跟权限有关的几个地方的关系图，不是权限实际应用的流程图。
:::
![权限示意图](http://assets.processon.com/chart_image/5ed316cc1e085306e3653418.png)

## 权限设置面板

权限设置面板是自动生成的，不需要额外的去写代码。但是需要在用到的地方引入 [lib-limit-setting](asd)。这是定义好的权限设置面板渲染器。

### 权限面板的数据来源

- APP 内所有的权限信息
  - 路由设置中的权限信息
  - 页面内的权限信息, 定义在 `preset.js limits` 字段中
- 接口权限信息

请注意，账号登陆时会从接口获取到权限信息。权限面板会根据从接口获得的权限信息，展示对应的权限内容，而不是 APP 内所有的权限内容。

```js
// 使用 lib-limit-setting 渲染器，应用权限面板
const editLimit = {
  type: 'lib-limit-setting',
  initApi: '$preset.apis.getLimit', // 需要控制的用户被选中的权限
  api: '$preset.apis.editLimit', // 保存权限的接口
}
```

#### Demo 应用的权限面板示例

![权限面板](/org/img/limit_setting.jpg)

### 保存已经置的权限

保存只需要配置好对应的的 API 接口。 权限设置好后，会产生 authData，会传入保存接口。

```js
// 保存权限时会携带的数据
const authData = {
  // 前端权限字符串, 实际上是数组转字符串。
  authLimit: '/blog/list,blog/list/add,blog/list/edit',
  // 用于后端接口限制的字符串, 实际上是数组转字符串。
  authApi: 'POST api/blog/xxx,PUT api/blog/xxx/$id',
}
```

#### `authLimit` 逗号分割的数组字符串

是勾选的权限，对应的前端渲染字路径。也是接口要返回前端的权限标识字符串。前端界面根据这个值做权限校验。

#### `authApi` 逗号分割的数组字符串

:::info API 权限拦截
需要后端开发人员根据权限面板提交的 `authApi` 数据，自己写 api 拦截器。
:::

是勾选的权限，对应的后端接口字符串。后端可根据这个值，判断用户对某个接口的访问是否受限。这需要后端写一个请求拦截中间件，如果访问接口，不在对应列表内，需要 返回 status 401/403 错误，或者返回 非 0 code 错误码。

## 获取接口权限

这里举例说明，接口是登录时候获取的。但是不限制接口权限从哪里获得，你可以从任何接口获取接口权限。

```js
import { app } from '@core/app'
import { setAppLimits } from '@core/routes/limit/exports'

app.request({
  url: 'POST api/login',
  onSuccess: (source) => {
    // highlight-next-line
    const userLimitString = source.data.limit
    // highlight-next-line
    setAppLimits(userLimitString) // setAppLimits 设置用户的接口权限
  },
})
```

> 注意： 如果 `userLimitString === rootLimitFlag` 表示为超级管理员，则前端不会校验任何权限。

## 权限验证

UI 界面在渲染时，需要先校验是否拥有对应权限。

- 无路由权限，则会显示，“当前页面不存在”，和 404 一致。
- 无操作页面内组件权限，则不会显示对应组件。

### 页面配置中校验权限

必须具有相应的权限，页面的 UI 节点，才会被渲染。

```js
// 页面配置文件 /src/pages/xx/index.js
export default {
  type: 'page',
  limits: '$page', // 路由权限
  body: {
    type: 'action', // 添加按钮
    label: '添加',
    limits: 'add', // 需要 add 权限，如果 add 权限没有，这个按钮将不会渲染
  },
}

//页面预设置文件 /src/pages/xx/preset.js
export default {
  // 当前页面所有需要的权限， 这里配置会被展示在权限面板中
  limits: {
    $page: {
      label: '访问页面',
    },
    edit: {
      label: '编辑',
    },
    add: {
      label: '添加',
      needs: ['edit'], // 依赖 add 权限，必须满足依赖才能被选中
    },
  },
  apis: {
    // 与权限相关的 api 都会在保存的时候，提交给接口
    edit: {
      url: 'POST api/xxx',
      limits: 'edit', // 该接口需要添加权限
    },
    add: {
      url: 'POST api/xxx',
      limits: 'add', // 该接口需要编辑权限
    },
  },
}
```

### 逻辑 Js 文件中校验权限

某些自定义组件中校验权限，需要调用 `checkLimitByNodePath`。

校验字符串是由 `页面路由/limits配置的key` 组成。举个例子：`/blog/add`。最后一个节点`/add` 就是在 `limits.add` 字段。

```js
import { checkLimitByNodePath } from '@core/routes/limit/exports'

// 存在添加权限
if (checkLimitByNodePath('/blog/add')) {
  //
}
```

## 接口权限实现控制

Ovine 只是提供一种 UI 界面权限控制方式，不限制后端 API 具体如何实现。也就说，你可以按照自己的需求去实现后端 API 接口限制。这里列举出两套常用且容易实现的方案。

### Api 接口拦截

有一部分接口不需要权限拦截，需要特殊处理。比如 登录接口，或者某些对外开放的接口。那么剩余的接口都需要被拦截。

- 登录拦截，如果未登录则需要登录再请求
- 登录时，获取到用户的所有授权的接口列表， `authApi`，如果该用户请求的接口，存不在于这个列表内，需要报错

### 超级管理员权限

也就是根权限，超级管理员是一个特殊用户，它具有 APP 内所有的权限。也就说，前后端的权限拦截，对于超级管理员不做任何拦截。

如何判断某个管理员是超级管理员？

#### 1. 配置超级管理标示符，默认是 “\*”

```js title="/src/index.js 应用入口配置"
export default {
  constants: {
    // highlight-next-line
    rootLimitFlag: '*', // 超级权限标识字符串，默认为 "*"
  },
}
```

#### 2. 接口返回的权限字符串与 `rootLimitFlag` 一致，则为超级管理员

### 权限实现逻辑

一般权限控制是由 `用户`、`角色`、`权限` 三部分组成。其对应关系是

- 创建用户

- 创建角色，每个角色中所有用户具有该角色对应的权限
  - 设置角色具有的权限
  - 将用户添加到角色中

### 权限分级

#### 单一级别版

单一权限级别较简单，很容易实现。所有用户不分上下级，没有级别的概念，只要某个用户具有`编辑权限`的权限，便可以编辑系统中任何人的权限。也就说，给 A 账号，开了`权限编辑`的权限，那么 A 可以编辑系统中任何人的权限。

因此后端几乎不需要额外的代码由前端就可以完成各种权限控制。整个权限体系，主要是控制 `编辑权限` 这个核心权限。将这个权限仅仅分配给高级人管理员拥有，系统中，每个人权限都由他来统一管理。

#### 多级别版

[Ovine Demo](https://ovine.igroupes.com/demo/) 使用用的是多级权限的方案,可自行体验。

与单一级别权限不一样，用户分为上级/下级关系。当 A 用户拥有`编辑权限`的权限时，只能给自己直接下级设置权限。对于整个系统来说，每个管理员只能管理由自己直接创建的下级用户相关信息。这需要后端自己开发相关功能。 如果你是 Java 为后端 Api 语言，可参考 [ovine-java-api](https://github.com/CareyToboo/ovine-java-api) 逻辑。
