---
id: changelog
title: 版本更新日志
---

[如何升级 Ovine？](/org/docs/advance/cli#ovine-版本升级)

[Ovine 计划表](/org/blog/plan)

### 0.0.5

- 支持 `[Amis Definitions](https://baidu.github.io/amis/docs/renderers/Definitions#definitions)` 添加纯 `Function` 转换
- `aside-layout` 中 `header,footer` 配置支持权限过滤
- 将 `Demo` 变为初始化项目默认选项
- 修复项目在 `Safari 浏览器` 白屏 BUG

### 0.0.4 ---- 2020.7.6

> 更新此版本后需要执行 `yarn ovine dll`

- 移除 `Amis` 配置中 `env.fetcher` 包裹的 `wrapperFetcher` 方法，所有请求逻辑均由 `Ovine` [请求模块控制](/org/docs/modules/request)
- 修复 `LimitSetting` 组件，在部分权限情况下，依然展示全部权限选项
- 调整 `getActionAddrMap` 返回数据。并在模版项目重新自定义了该部分逻辑
- 模版项目添加了登陆时权限检查功能

### 0.0.3 ---- 2020.6.26

- 修复 `url-loader` 正则文件匹配错误
- 修复 `url-loader` 排除了 `node_modules` 目录，因此会导致第三方包的资源文件引入报错
- 修复权限面板编辑时，弹窗提示报错 `QuckApiSchma is required`
- 修复 Table 分页时，数字与图标没有对齐
- 修复 `GET` 请求参数包含特殊字符，会被 encode 两次的问题

### 0.0.2 ---- 2020.6.20

> 更新此版本后需要执行 `yarn ovine dll`

- 将 lodash 加入 dll 打包文件中
- 修复 dev 开发时，出现异常热更新失效问题
- 修复权限面板选择权限时，选项出现的小抖动问题
- 添加 Demo 模版登陆窗口对移动端兼容

### 0.0.1 ---- 2020.6.17

- 发布 Ovine 正式基础版本

### 0.0.1-alpha.12

- 重构 `request` 模块，尽量与 `amis` 自带的 api 模块兼容
- 去除不必要配置 `constants.actionAddrMap` 需要用此功能需自行实现
- 重新整理了 `init` 项目的结构
- 更新到 `amis 1.0.14` 最新版
- 修复一系列已知道 BUG
  - 修复 windows 系统 使用 `@ovine/init` 初始化项目后 `build` 出现异常的问题
  - actionType 为 `url` 时无法跳转

### 0.0.1-alpha.11

- 暂时锁定 assets-webpack-plugin 为 3.9.12 版，因为 3.10 版本报错

### 0.0.1-alpha.10

- 支持 `amis definitions` 使用 `limits` 进行权限过滤
- `ovine cli` 添加 `--scss` 选项支持，对 `amis scss` 文件实时编译
- 修复权限组件，同步`api`权限 不匹配的 BUG。
- 添加 `demo` 模版
