---
slug: migration_v1
title: 0.1.x 版本更新日志
---

主要修改是将 cli 与功能 core 模块独立处理来。因此为了区分是使用的哪一种模式，在 `src` 文件夹，入口处做了一下区分。

- `src/app.auto.js` 是自动模式，直接使用 `ovine` 应用配置就行。如果是迁移 `0.0.x` 迁移至 `0.1.x` 则只需要将 `src/index.js` 文件名改成 `src/app.auto.js` 即可完成迁移。
- `src/app.custom.js` 是半自动模式，只加入了一些非常基础的代码引入，可以几乎不用 `core` 逻辑
- `src/app.js` 完全自定义模式，不做任何处理，相当于一个完全的独立的应用，可以几乎不用 `core` 逻辑
