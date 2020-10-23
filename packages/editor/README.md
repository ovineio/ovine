## 基于 AMIS 的在线建站应用

- amis-editor: 2.0.4
  防止依赖 amis 包有异常，先写死 amis-editor 包的内容，每次升级需要自行关联 amis-editor 更新相关的内容
- amis-editor 修改
  - 去除多余的 env 变量
  - 插入组件时 关闭组件抽屉

* amis
* amis-editor
* ovine
  - cli
  - core
* 支持自定义开发与在线编辑结合

TODO:

- 将 ovine 支持的自定义组件全部都添加到 amis-editor 中
- 接入 API 功能
- 定时保存
- 更多参数
