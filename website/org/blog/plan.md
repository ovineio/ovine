---
slug: plan
title: 迭代计划表
---

> Ovine 正在起步阶段，目前极度缺前端开发者！如果对 Ovine 感兴趣，希望与我们一起贡献代码，欢迎联系我们。[贡献指南](/org/blog/contribute)

:::info ovine 官方提示
影响使用的紧急 BUG，是 Ovine 所有开发中的最高优先级，一般在 3-5 天内，第一时间修复。
:::

### TODO 列表

#### `0.1.x` 处理使用上的问题

- 0.1.4
  - `ovine.config.js` 相关
    - 添加 `appKey`标识符，用于区分同域名下,不同`ovineApp`的 `store`
    - 默认设置为 `dll: { useJsdelivr: true }`, 并当 `dll cdn` 配置生效时，不将 dll 目录下的文件复制到 `dist` 目录中
    - 将 `routePrefix` 默认设置为 `config.js`中的 `publicPath`
    - 修复: `theme 初始化加载 css 文件 可能会出现, 界面抖动的情况`
- 0.1.5
  - 添加 `yarn ovine version`

#### `0.2.x` 着重处理编辑器相关的需求

- 编辑器 添加 `icon` 选择 picker
  - 支持搜索
  - baidu/fontAwesome 自带图标
  - 支持 阿里 iconfont svg 图标

#### `0.3.x` 着重 处理编译升级/性能/优化 相关的需求

- 添加 `serviceWork` 缓存支持
- 升级 `webpack5.x`

#### `0.4.x` 添加插件体系

### 版本发布时间节点

- 新版本发布时间一般在 `周六-周日上午`
- `周1 - 周5` 只发布紧急 BUG 修复版本

> 对 Ovine 的发展有任何建议，或者发现 BUG，欢迎上 [Github Issues](https://github.com/CareyToboo/ovine/issues) 提出来。或者加 Q 群，直接沟通。
