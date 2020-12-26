---
slug: plan
title: 迭代计划表
---

> Ovine 正在起步阶段，目前极度缺前端开发者！如果对 Ovine 感兴趣，希望与我们一起贡献代码，欢迎联系我们。[贡献指南](/org/blog/contribute)

:::info ovine 官方提示
影响使用的紧急 BUG，是 Ovine 所有开发中的最高优先级，一般在 3-5 天内，第一时间修复。
:::

### 建立前端低代码平台

- 完成前端低代码平台基本需求
  - 可在线建立多个应用
  - 可建立企业组织架构与权限
  - 可在线编辑页面，并发布前端更改
- 将项目中 `菜单/路由/权限` 均支持接口动态获取
- 暂时先接入在 Ovine 中接入 [amis-editor](https://fex-team.github.io/amis-editor/)，实现可以在线编辑页面需求。(`Ovine Editor` 短时间难以上线，但是大量开发者对在线编页面需求很强烈)

### Core 计划表

- 新功能
  - 编写 `ovine version` 命令，提供更简单方式升级，以及版本不兼容提示
  - 兼容多语言
- 文档相关
  - 将 `typescript` 类型格式文档，转换为 `Table` 格式，对搜索更友好。
  - 添加适当入门视频介绍，降低使用门槛
- 优化相关
  - 体验优化
  - 主题优化
  - 性能优化
    - `workbox` 缓存优化

### 版本发布时间节点

- 新版本发布时间一般在 `周六-周日上午`
- `周1 - 周5` 只发布紧急 BUG 修复版本

> 对 Ovine 的发展有任何建议，或者发现 BUG，欢迎上 [Github Issues](https://github.com/CareyToboo/ovine/issues) 提出来。或者加 Q 群，直接沟通。
