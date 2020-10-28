## @ovine/cli 命令行工具

对 webpack 简单封装，提供开箱即用的开发与构建功能。

TODO:

- 去除对 `dll` 中对 `pulicPath` 强绑定的地方 ----- 将 `publicPath` 决定权交给 `cli` 处理，方便静态文件随便仍到 CDN 中
  - fontawesome 等静态文件，去除对资源文件的 `publicPath` 的强依赖
  - `editor` 编辑器
- 对静态文件均加入 `host` 头, 方便在不同环境正常运行
