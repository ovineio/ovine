# Ovine

![download](https://img.shields.io/npm/dt/@ovine/core?color=%23349c92b) ![version](https://img.shields.io/npm/v/@ovine/core?color=%2349c92b) ![node](https://img.shields.io/node/v/@ovine/cli?color=%23349c92b) ![license](https://img.shields.io/npm/l/@ovine/core?color=%23349c92b)

##### Ovine 支持使用 Json 构建完整的管理系统界面。

`QQ交流群: 1037291990`

> 在本项目使用中，有任何问题、需求、建议，请提交 issue 或者加入 Q 群讨论。我看到后将第一时间处理。如果本项目对你有帮助，请点 `star` 支持，非常感谢 ^\_^

### 功能

- #### [Amis](https://baidu.github.io/amis/examples/pages/simple)

  - 基于 `bootstrap`
  - 基于 `typescript` 代码开发友好
  - 支持 `json` 配置渲染逻辑复杂的表单或页面，该功能十分强大
  - 拥有齐全的 `admin` 组件库，完全满足一般管理系统需求
  - 该框架已经广泛应用于企业级项目中，经得起实践的考验
  - 百度 FEX 团队更新频率高 (约两个月发布一个线上版本，平均每天 5 个代码提交)
    - 需求、功能升级、BUG、优化 等都有保障
    - 中文文档且文档内容较为齐全

- #### Ovine [查看文档](https://ovine.igroupes.com/org/)

  - 基于 `amis` 二次开发，拥有其所有优势
  - 支持生成自定义 `amis` 主题
  - 基于 `webpack` 打包，简单、速度快、支持热更新
  - 通用基本功能，开箱即用
    - 路由、权限、页面、组件 都由 `json` 配置，可简单、快速的生成复杂的 `curd` 表单或页面
    - 内置企业级权限管理完整实现，并集成到 `json` 配置中
      - 支持权限依赖、自定义设置权限、定义好权限后，可控制任何节点
    - 路由懒加载、配合 `webpack dll`，页面加载速度快
  - 强大的 mock 方案，实现脱离后端开发，轻松对接

### 项目演示 [[预览]](https://ovine.igroupes.com/demo/)

##### 个性化主题

![个性化主题](https://static.igroupes.com/rt-admin-intro-theme.gif)

##### JSON 配置 路由、页面、Form、组件

![JSON 配置](https://static.igroupes.com/rt-admin-intro-json-1.gif)

##### 强大权限管理 (集成在配置中，无需开发)

![权限管理](https://static.igroupes.com/rt-admin-intro-limit.gif)

### Ovine 适合谁？

- 适合`企业内部`运营管理后台
- 适合需要`强大权限`管理的后台
- 适合`成百上千`个crud 操作的后台
- 适合对自定义 UI 要求`不是极其高`的后台
- 适合喜欢偷懒的前端开发
- 适合喜欢钻研的后端开发
- 适合外包项目、私活
- 最后，我希望它适合你，节约你宝贵的时间 ^\_^ ～

### [OVINE 版本日志](https://ovine.igroupes.com/org/blog/changelog/)

### TODO

- 第一阶段

  - 提供完整的基础项目模板，做到上手即用
  - 构建完整 DEMO 应用，实现管理后台基础功能
  - 持续修复现存 BUG
  - 完善的开发文档

- 第二阶段

  - 开发 UI 界面编辑器
  - 读取 API 数据渲染应用

- 第三阶段
  - 组件插件体系

> 期待你的 PR，支持开源 ^\_^

### 资源

- [amis](https://baidu.gitee.io/amis/zh-CN/docs/start/getting-started) 非常感谢百度团队的开源贡献
- [font-awesome](http://fontawesome.dashgame.com)
- [bootstrap](https://v3.bootcss.com/components)
- [styled-components](https://styled-components.com)
