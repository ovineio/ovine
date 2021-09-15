---
id: overview
title: Ovine
---

#### 一个支持使用 `Json` 构建完整管理系统 UI 的框架，基于 [Amis](https://baidu.gitee.io/amis/zh-CN/docs/index) 二次开发。

![download](https://img.shields.io/npm/dt/@ovine/core?color=%23349c92b) ![version](https://img.shields.io/npm/v/@ovine/core?color=%2349c92b) ![license](https://img.shields.io/npm/l/@ovine/core?color=%23349c92b)

- [快速开始使用 Ovine](/org/docs/guides/start)
- [一些常见问题](/org/docs/intro/faq)
- `QQ 交流群：1037291990`

## 初衷

Ovine 使用 Json 格式数据，渲染 UI 界面，避免大量重复单一的工作。当对配置规则熟悉之后，可极大的提升前端页面编写效率。

> **题外话:** 管理后台项目是既非常重要，开发起来又相当繁琐。Admin 项目做得好是框架好，做得差，是你代码写得差，也因此 Admin 项目长期处于比较尴尬的地位。此外开发 Admin 需求，企业不会安排太多时间，大家都想又快又好。因此能够快速完成业务需求，才是合适的。

## 目标

以 `Amis` 框架为基础，以 [`爱速搭`](https://suda.baidu.com/)、[`飞冰`](https://ice.work/) 为参照，以零成本快速搭建一个前端低代码平台体系，实现前端页面在线编辑、预览、发布。并提供一套可扩展的自定义功能接口，以满足部分特定的需求。

> 官方正在寻找可长期维护 Ovine 的前端开发者共同贡献代码，感兴趣的同学，欢迎与我们联系～

## 特性

- #### 开箱即用

  - 配套项目生成工具，**3 分钟左右可以快速构建一个 Admin 应用**
  - 无需再额外搭建开发环境
  - 直接上手 Json 配置页面、表单、权限、并对接 API

- #### Json 格式数据生成界面

  - 配置 路由、页面、权限、CRUD 操作 都集成在 Json 配置中
  - 使用 Json 配置可以高效快速的完成各类型的表单数据展示页面
  - 可无缝接入自定义组件或者第三方组件，支持随意扩展

- #### 完整的权限校验体系

  - 权限实现前后端分离控制
    - 前端控制 界面元素 根据权限展示
    - 后端控制 API 接口访问权限
    - 后端可记录完整的用户操作路径
  - 权限使用 Json 配置，非常方便，扩展性极强
  - 支持简单的权限匹配逻辑

- #### 高可扩展的样式主题

  - 可采用 `scss` 变量更改界面样式展示，共 1000+ 可自定义设置的样式变量
  - 样式使用 `css in js` 可以将样式按照数据的方式数据写入 Json 中
  - 支持添加全新的自定义主题

- #### 简洁的数据 Mock 方案

  - 生成 Mock 数据方便，可完全独立于后端 API，进行业务开发
  - Mock 数据与真实 API 数据，无缝切换

## [预览演示项目](https://ovine.igroupes.com/demo/login)

##### 个性化主题

![个性化主题](https://static.igroupes.com/rt-admin-intro-theme.gif)

##### json 配置 路由、页面、Form、组件

![json 配置](https://static.igroupes.com/rt-admin-intro-json-1.gif)

##### 强大权限管理 (集成在配置中，无需开发)

![权限管理](https://static.igroupes.com/rt-admin-intro-limit.gif)
