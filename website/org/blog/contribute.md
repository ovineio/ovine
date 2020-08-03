---
id: contribute
title: 贡献指南
---

> 强烈推荐使用 yarn 作为包管理器

#### 安装项目依赖

1. 在 `ovine/` 根目录下

   - 执行 `yarn install` 安装依赖包
   - 执行 `yarn tsc` 编译项目代码

2. 启动 `example` 项目

   - 进入 `ovine/website/example/` 目录下
   - 如果没有安装 `node-sass` 需要安装一下（全局/项目内安装均可）
   - 执行 `yarn install` 安装依赖包
   - 执行 `yarn prepare` 生成一些静态文件
   - 执行 `yarn dev:lib` 正常开启本地服务器，进行开发

## Ovine 简单介绍

项目整体由三个 npm 包组成。

- `packages/cli` 封装 webpack 配置
- `packages/core` 封装 amis 基础库
- `packages/init` 快速初始化模版项目

开发时主要是以 `example` 项目为基础进行功能开发与测试。

如果修改了 `packages/cli` 中的代码，需要在 `packages/cli` 目录下，执行 `yarn tsc` 编译对应的包，在 `example/` 目录中，通过 `yarn cp:lib:cli` 将 cli 包拷贝到 example 项目中。重新执行 `yarn dev:lib` 开发命令，并测试对应的改动。

如果需要修改 `packages/core` 中的代码，需要在 `packages/core` 目录下，执行 `yarn dev` 命令实时编译对应的包。可以在 example 项目中，实时预览对应改动，并进行测试。

> 需要其他支持？欢迎上 [Github Issues](https://github.com/CareyToboo/ovine/issues) 提出来。或者加 Q 群，直接沟通。
