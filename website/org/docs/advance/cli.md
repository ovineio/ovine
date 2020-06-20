---
id: cli
title: Cli 命令
---

Ovine Cli 工具由 `@ovine/cli` 包提供，二次封装了 webpack 一系列配置。

主要添加了以下功能:

- 内置了 Ovine 应用必备的开发环境
- 添加了 Amis 主题编译，并且可方便的增加属于自己项目的个性化主题
- 内置 [Webpack Dll](https://zhuanlan.zhihu.com/p/84595664) 优化，不仅能够减少构建时间，还可实现浏览器长期缓存
- 结合 `react-hot-loader` 添加了热更新功能，使开发更加顺畅
- 可对按路由拆分文件，实现代码按需加载

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

默认 false。此选项需要与 `ovine scss -w` 命令配合使用，可以实时预览主题文件修改后的效果。

#### --no-dll 不启用 dll

默认 false。不启用 dll 编译会非常慢。但是可以看到更多 `react` 的报错信息。

#### --no-open 不默认打开浏览器

默认 false

### `yarn ovine build`

#### --mock 是否开启 mock 数据功能

默认 false。开启 mock 后，可以使用 `mock.js` 数据。否则 `mock.js` 数据无效。

#### --env 当前应用环境

默认 production，如果非 `production` 环境可以自行设置，其他环境。

#### --bundle-analyzer 开启打包分析

是否开启 build 构建的依赖分析，默认 false。当有需要的时候可以使用此参数，更加详细的了解 build 包的大小。

### `yarn ovine dll` 打包 dll 文件

是将 amis 等一系列依赖包提前打包，不必每次构建都打包，可以加快构建速度，也可以使浏览器长期缓存，加快页面加载速度。每次 amis 升级，或者其他 dll 依赖包升级，都需要重复执行该命令。

> Amis 的依赖包还比较多的，构建 DLL 比较缓慢，此命令时间较长，大约 1-2 分钟左右，请耐心等待。

#### --bundle-analyzer 开启打包分析

是否开启 dll 构建的依赖分析，默认 false。当有需要的时候可以使用此参数，更加详细的了解 dll 包的大小。

### `yarn ovine scss` 编译 scss

Ovine 默认采用 `css in js` 方式写样式。但是 `amis` 使用的 `scss` 写样式。因此每当 `amis` 更新时，或者当更改 `scss` 主题变量时，都需要重新编译一下 amis 的样式。

#### -w 监听 scss 文件改动，实时编译

#### --verbose 打印详细日志

### Ovine 版本升级

[Ovine 版本更新日志](/org/blog/changelog/)

由于 Ovine 是一个应用型的框架，对 `Amis` 进行了封装，并内置了一些常用功能。如果想升级 `Amis`，必须升级 `Ovine`相关 npm 包。升级 `Ovine` 需进行以下操作。

- 更新 `Ovine` 相关 npm 包

  - `yarn upgrade @ovine/cli` 更新 cli 工具
  - `yarn upgrade @ovine/core` 更新 core 包

- 当 `Ovine` 更新了 `Amis` 版本时，需要额外进行下列步骤

- `yarn ovine dll` 编译 Dll 静态资源文件
- `yarn ovine scss` 编译 Amis 样式

- 当 `Ovine` 只更改了 Dll 相关配置时，仅需要执行 `yarn ovine dll` 即可

> 除了更新这些，如果有重大改版，还需要对应代码细节，进行代码改动。
