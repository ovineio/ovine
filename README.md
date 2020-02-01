# RT-Admin

一个仅需 json 配置就可以实现复杂的 admin 管理系统的框架。基于 [amis](https://github.com/baidu/amis) 二次开发。

> 在本项目使用中，有任何问题、需求、建议，请提交 issue。我看到后将第一时间处理。如果本项目对你有帮助，请点 `star` 支持，非常感谢 ^\_^

### 功能

- #### [Amis](https://baidu.github.io/amis/pages/simple)

  - 基于 `bootstrap`
  - 基于 `typescript` 代码开发友好
  - 支持 `json` 配置渲染逻辑复杂的表单或页面，该功能十分强大
  - 拥有齐全的 `admin` 组件库，完全满足一般管理系统需求
  - 该框架已经广泛应用于企业级项目中，经得起实践的考验
  - 百度 FEX 团队更新频率高 (约两周一个版本)
    - 需求、功能升级、BUG、优化 等都有保障
    - 中文文档且文档内容较为齐全

- #### RtAdmin [[预览 Demo]](http://rt-admin.igroupes.com/)

  - 基于 `amis` 二次开发，拥有其所有优势
  - 最基本的 `react` 技术栈，拥抱 `react` 生态，无任何学习曲线。(如果非 React 技术栈，可选择 [[amis jsSdk]](https://baidu.github.io/amis/docs/getting-started#jssdk))
  - 支持生成自定义 `amis` 主题
  - 基于 `webpack` 打包，简单、速度快、支持热更新
  - 通用基本功能，开箱即用
    - 路由、页面、组件 都由 `json` 配置，可简单、快速的生成复杂的 `curd` 表单或页面
    - 内置企业级权限管理完整实现，并集成到 `json` 配置中
    - 路由懒加载、配合 `webpack dll`，页面加载速度快
    - 本项目的内置功能修改起来十分简单，关键代码均有注释

### 快速开始

```
git clone git@github.com:CareyToboo/rt-admin.git
yarn install
yarn dev # 开发
yarn build # 打包
yarn open:dist # 预览打包后的页面

# 构建参数 参照 build/utils.js 文件

# 其他命令
yarn build:dll # 构建dll，一般不需要使用
yarn build:theme # 构建主题， 当需要自定义amis主题时
yarn build:analyzer # 打包代码分析
```

### 开发工具

- 推荐使用 `vscode` 并下载对应插件，将极大提升开发效率与开发体验
- 必备 `vscode-plugin` 可自行下载
  - `tslint` - ts 代码检查
  - `prettier` - 可自动格式化代码
  - `vscode styled component`- `css` 提示
  - `path intellisense` - 路径自动补全
  - `search node_modules` - 快速查看 `node_modules` 包中源文件
  - `code spell checker` - 检查错误单词

## 资源

- [amis](https://baidu.github.io/amis/docs/getting-started) 非常感谢百度团队的开源贡献
- [font-awesome](http://fontawesome.dashgame.com)
- [bootstrap](https://v3.bootcss.com/components)
- [styled-components](https://styled-components.com)
