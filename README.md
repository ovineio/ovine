# RT-admin

rt-admin管理后台系统基于[ant-design-pro](https://github.com/ant-design/ant-design-pro)的ts重构版本，针对中小型公司内部业务的一体化解决方案。主要目的是应用于强运营性业务，超多表格的管理系统。

## 核心技术栈

- [react](https://github.com/facebook/react)
- [typescript](https://github.com/facebook/react)
- [ant-design](https://github.com/ant-design/ant-design)
- [dva](https://github.com/dvajs/dva)
- [roadhog](https://github.com/sorrycc/roadhog)
- [redux-saga](https://github.com/redux-saga/redux-saga)

## 开发

1. node 开发版本 7.10.0
2. typescript 版本 2.9.2

```bash
yarn install
yarn run start:mock # 开启mock服务
yarn run start # 默认开始项目
```

### 主要功能

- 完整的权限设置
  - 支持粒度前端路由，表操作
  - 后端每个接口控制
- 动态路由`yaml配置`
- 对纯表格页面`tableview`功能封装`json配置`
  - 检索条件
  - 表列数据渲染
  - 表格增、删、改操作
  - 表格弹框编辑
  - 表格常用工具




