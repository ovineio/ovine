---
id: related
title: 项目依赖
---

## 主要依赖

一般项目使用 Json 配置就可以搞定了，不会开发自定义组件。如果一定要需要自定义组件，则需要使用 React。本项目是二次封装 Amis。因此熟悉 Amis 的功能，对开发项目会事半功倍。

- **[react](https://reactjs.org/)** 官方文档
- **[amis](https://github.com/react-dnd/react-dnd)** Json 渲染为组件的库
- **[styled-component](https://github.com/artf/grapesjs)** Css In Js 样式库，简单容易使用
- **[immer](https://github.com/pelotom/use-methods)** 状态持久化库，可以更加方便的设置组件状态
- **[font-awesome](https://github.com/pelotom/use-methods)** 所有图标项目内可直接使用

### 一系列其他依赖包

Amis 依赖了大量组件相关基础依赖包，Ovine 也依赖很多 Cli 相关的依赖包，因此虽然没有写在 package.json 里面，但是也可以直接 `import` 使用的。这里列出主要可以直接使用的依赖包。更详细的可以使用`vscode serach node_modules plugin`查询。

- `lodash` 函数工具库
- `jquery` dom 操作等
- `react mobx` 状态管理
