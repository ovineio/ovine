## @ovine/craft UI 编辑器

UI 通过点选的方式简化 JSON 配置过程，通过点选关联数据的方式，快速实现页面编辑的工具。

### TODO:

- 添加 请求/操作/表单---- 面板
- 添加 选择器弹窗--功能

- 添加 hover 快捷操作
- 添加 右键 contextMenu
- 保存功能

- 代码编辑器

- 接入 Ovine 中

- ！！思考如何编写自定义组件

### schmea 原则

- 配置可扩展性最强
  - 能使用 Array 地方均使用 Array
  - 能扩展的地方全部扩展---比如，title: xxx ==> 可扩展为 title: [{type: 'html', html: 'xx'}]
- 尽可能优化 复制/剪切/粘贴 等操作
