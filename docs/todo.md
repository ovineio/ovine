## Road Map

### 基本功能梳理与完善

- [x]  部分组件由 js 转换成 TS，TSX 增加参数验证
- 支持 Mock 接口简单开发
  - [x] 支持简单的 增删改查，restful mock 接口生成
  - [x] 可以完全调用成功，去除项目前期对于接口的依赖
- 完善 TableView 组件
  - [x] 基本 TableView 配置流程
  - [x] 接入 form 表单
  - [ ] 实现表格工具方法（左下角）
- [x] 权限模块 [已简单处理]
  - [x] 系统用户表
  - [x] 权限设置
- 添加 dashboard
  - [ ] layout 布局
  - [ ] 添加几张图表，基类
- 完善 FormInput 公共模块
  - [x] Select 异步数据组件，[已简单处理]。
  - [ ] Date 日期组件，需要设计 `高`
  - [ ] RichEditor [异步加载]
  - [ ] CodeEditor [异步加载]
  - [ ] MarkdwonEditor [异步加载]
  - [ ] PageEditor [异步加载] `低`
  - [ ] VideoPlayer [异步加载]
- 优化 menu 配置信息，tableconfig 配置
  - [x] 路由支持 yaml 动态配置 `高` [done]
  - [x] 整理文件命名格式，取消组件文件首字母大写 [done]
  - [x] 除 component 文件夹下组件其他文件转换为 ts，jsx->tsx 一切暂以 any 参数或者简单校验。 [done]
  - [x] 去除重复、多余冗余配置 [done] `高`
  - [ ] 优化 tableview，menu，request 配置参数
- [ ] 优化界面样式
  - [ ] 侧边栏需固定
- 表格渲染存在性能问题-优化方案
- [x] clomun 渲染 优化，文字样式字段显示剥离 [done]
- [x] filter 组件重构，规范化 [done]
- [ ] plgination 组件性能问题 --- antd 的问题

### 其他非核心需求

- [ ] 添加整站搜索功能实现
- [ ] 测试模块
  - [ ] 添加工具函数测试代码
  - [ ] 添加组件测试代码
- [ ] 其他功能
  - [ ] 支持多语言化
  - [ ] 支持整站换肤
