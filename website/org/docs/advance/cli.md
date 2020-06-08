---
id: cli
title: Cli 命令
---

Ovine Cli 工具由 `@ovine/cli` 包提供，二次封装了 webpack 一系列配置。

主要添加了以下功能:

- 内置了 Ovine 应用必备的开发环境
- 添加了 Amis 主题编译，并且可方便的增加属于自己项目的个性化主题
- 内置 [Webpack Dll]() 优化，不仅能够减少构建时间，还可实现长期缓存
- 结合 `react-hot-loader` 添加了热更新功能，使开发更加顺畅
- 可对按路由拆分文件，实现代码按需加载

预计将要添加的功能

- 集成 [Workbox](https://developers.google.cn/web/tools/workbox/guides/get-started) 优化文件缓存
- 添加 `add page` 快速添加页面功能

> 将 `ovine` 添加到 `package.json scripts` 中，可简单使用 `yarn ovine` 执行以下命令

```json
{
  "scripts": {
    "ovine": "ovine"
  }
}
```

### `yarn ovine -h` 查看帮助

列出 ovine 命令的所有帮助项，或者查看具体的命令的帮助。 `yarn ovine dev -h` 查看 `dev` 命令的帮助信息。不必记忆所有的文档所有内容，需要时查看帮助即即可。

### `yarn ovine dev`

#### -p 启动端口

默认 7050

#### --host 启动的 host

默认 localhost

#### --mock 是否开启 mock 数据功能

默认 false

#### --env 当前应用环境

默认 localhost

#### --scss 开启 scss 更新

默认 false

#### --no-dll 不启用 dll

默认 false

#### --no-open 不默认打开浏览器

默认 false

### `yarn ovine build`

#### --mock 是否开启 mock 数据功能

默认 false

#### --env 当前应用环境

默认 production

#### --bundle-analyzer 开启打包分析

默认 false

### `yarn ovine dll` 打包 dll 文件

#### --bundle-analyzer 开启打包分析

默认 false

### `yarn ovine scss` 编译 scss

#### -w 监听 scss 文件改动，实时编译

#### --verbose 打印详细日志
