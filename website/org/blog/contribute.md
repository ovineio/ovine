---
slug: contribute
title: 贡献指南
---

> 项目内使用了 workspace 功能，并且 scripts 也都是使用 yarn，几乎必须使用 yarn 作为包管理器。

#### 安装项目依赖

1. 首次 `clone` 项目，在 `ovine/` 根目录下

   - 如果未使用过 `yarn`, 需要全局安装一下 `yarn`, 防止无法正常启动项目
   - 执行 `yarn install` 安装依赖包，或者使用 `npm v7+`, 并执行 `npm install --legacy-peer-deps`，也可正常安装依赖
   - 执行 `yarn prepare:dev` 编译项目代码，并将自动启动 `demo` 项目

2. 正常开发 `example` 项目
   - 直接 在 `ovine/` 目录中，执行 `yarn start:demo`
   - 或者，进入 `ovine/website/example/` 目录下
     - 执行 `yarn start` 正常开启本地服务器，进行开发

## Ovine 简单介绍

项目整体由三个 npm 包组成。

- `packages/cli` 封装 webpack 配置
- `packages/core` 封装 amis 基础库
- `packages/init` 快速初始化模版项目

开发时主要是以 `example` 项目为基础进行功能开发与测试。

如果修改了 `packages/cli` 中的代码，需要在 `packages/cli` 目录下，执行 `yarn tsc` 编译对应的包，在 `example/` 目录中，通过 `yarn cp:lib:cli` 将 cli 包拷贝到 example 项目中。重新执行 `yarn dev:lib` 开发命令，并测试对应的改动。

如果需要修改 `packages/core` 中的代码，需要在 `packages/core` 目录下，执行 `yarn dev` 命令实时编译对应的包。可以在 example 项目中，实时预览对应改动，并进行测试。

##### 整体要求：

1. 使用 `TS、TSX` 编写代码与完整类型检查
2. 文件目录与文件名统一使用**下划线**分割 (声明：虽与主流命名格式有所不同，但本项目按此标准编写，见谅～)
3. 项目种有使用 `JsLint` 代码风格校验，按要求编写即可

> 需要其他支持？欢迎上 [Github Issues](https://github.com/CareyToboo/ovine/issues) 提出来。或者加 Q 群，直接沟通。
