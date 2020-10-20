### 架构 QianKun

### Editor 接入编辑器

- 引入 amis-editor

### CLI/CORE 调整

- [x] 去除入口自动引入 `app/src/index` 入口文件 逻辑
- [x] 将 `react、react-dom、react-router、styled-components` 打单 dll 独包,所有其他文件再单独打包(拆分为两个入口)
- [x] 支持 `core` 路由，侧边栏，权限， 动态 api 获取

- 支持整个站点使用 `cdn` 缓存文件
- `core` 添加 `node_modules/xx` 特殊文件打包优化

### TODO

- 重构 CLI/CORE
- qiankun
- webpack

### 使用 微服务 架构构建项目

- 平台介绍项目
  - 文档相关
- 工作台项目
- 编辑器 ---- 用于编辑页面
- 测试预览项目----普通只可使用相关功能项目

* 1. 平台页面
  - 1. 登陆
  - 2. 注册
  - 组织体系
    - 建立组织架构
    - 被邀请加入组织
  - 应用体系
    - 编辑应用
    - 编辑目录
    - 编辑应用权限
  - 平台角色
