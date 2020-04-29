# Ovine

##### 用 JSON 配置就能生成安全、复杂、可扩展的 `Admin` 管理系统。

基于 [amis](https://github.com/baidu/amis) 二次开发。

> 在本项目使用中，有任何问题、需求、建议，请提交 issue。我看到后将第一时间处理。如果本项目对你有帮助，请点 `star` 支持，非常感谢 ^\_^

### 功能

- #### [Amis](https://baidu.github.io/amis/pages/simple)

  - 基于 `bootstrap`
  - 基于 `typescript` 代码开发友好
  - 支持 `json` 配置渲染逻辑复杂的表单或页面，该功能十分强大
  - 拥有齐全的 `admin` 组件库，完全满足一般管理系统需求
  - 该框架已经广泛应用于企业级项目中，经得起实践的考验
  - 百度 FEX 团队更新频率高 (约两三周一个版本)
    - 需求、功能升级、BUG、优化 等都有保障
    - 中文文档且文档内容较为齐全

- #### Ovine

  - 基于 `amis` 二次开发，拥有其所有优势
  - 最基本的 `react` 技术栈，拥抱 `react` 生态，无任何学习曲线。(如果非 React 技术栈，可选择 [[amis jsSdk]](https://baidu.github.io/amis/docs/getting-started#jssdk))
  - 支持生成自定义 `amis` 主题
  - 基于 `webpack` 打包，简单、速度快、支持热更新
  - 通用基本功能，开箱即用
    - 路由、权限、页面、组件 都由 `json` 配置，可简单、快速的生成复杂的 `curd` 表单或页面
    - 内置企业级权限管理完整实现，并集成到 `json` 配置中
      - 支持权限依赖、自定义设置权限、定义好权限后，可控制任何节点
    - 路由懒加载、配合 `webpack dll`，页面加载速度快
    - 本项目的内置功能修改起来十分简单，关键代码均有注释
  - 强大的 mock 方案，实现脱离后端开发，轻松对接

### 项目演示 [[预览 Demo]](https://ovine.igroupes.com/)

##### 个性化主题

![个性化主题](http://static.igroupes.com/rt-admin-intro-theme.gif)

##### JSON 配置 路由、页面、Form、组件

![JSON 配置](http://static.igroupes.com/rt-admin-intro-json-1.gif)

##### 强大权限管理 (集成在配置中，无需开发)

![权限管理](http://static.igroupes.com/rt-admin-intro-limit.gif)

### Ovine 适合谁？

- 适合`企业内部`运营管理后台
- 适合需要`强大权限`管理的后台
- 适合成`百上千个`crud 操作的后台
- 适合对自定义 UI 要求`不是极其高`的后台
- 适合喜欢偷懒的前端开发
- 适合喜欢钻研的后端开发
- 适合外包项目、私活
- 最后，我希望它适合你，节约你宝贵的时间 ^\_^ ～ (PS: 本项目采用的项目架构，也值得参考喔～)

### TODO

- 第一阶段

  - 持续修复现存 BUG
  - 搭建文档页面
  - 继续完善 `demo` 项目，最终上线为实际应用
  - 核心模块编写测试代码
  - 配套 `api` 开发

- 第二阶段

  - 发布 npm 包，减少开发者使用门槛
    - 将现在项目进行拆分，核心公用代码抽离为 `npm` 包，其他代码作为 `demo` 应用
    - 思考如如何 去 `react` 化，兼容更多库。
  - 实现 `api` 实时构建 `admin` 页面

- 第三阶段
  - 实现拖拽生成 `UI`，并产生 `admin` 页面，降低使用门槛

> 期待你的 PR，支持开源 ^\_^

### 资源

- [amis](https://baidu.github.io/amis/docs/getting-started) 非常感谢百度团队的开源贡献
- [font-awesome](http://fontawesome.dashgame.com)
- [bootstrap](https://v3.bootcss.com/components)
- [styled-components](https://styled-components.com)
