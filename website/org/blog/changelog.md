---
id: changelog
title: 版本更新日志
---

### 0.0.1-alpha.12

- 修复 windows 系统 使用 `@ovine/init` 初始化项目后 `build` 出现异常的问题
- 重构 `request` 模块，尽量与 `amis` 自带的 api 模块兼容
- 去除不必要配置 `constants.actionAddrMap`需要用带此功能自行实现
- 重新整理了 `init` 项目的结构

### 0.0.1-alpha.11

- 暂时锁定 assets-webpack-plugin 为 3.9.12 版，因为 3.10 版本报错

### 0.0.1-alpha.10

- 支持 `amis definitions` 使用 `limits` 进行权限过滤
- `ovine cli` 添加 `--scss` 选项支持，对 `amis scss` 文件实时编译
- 修复权限组件，同步`api`权限 不匹配的 BUG。
- 添加 `demo` 模版
