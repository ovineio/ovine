## 已知 BUG

- `a:not([href])` 颜色异常 --- 简单修复，坐等 amis 升级
- 偶尔还是会出现 `cannot update readonly` 属性。这个问题出在 mock.js 这文件修改之后，但是不是毕现，因此需要排查问题。
- 删除没有提示 --- 不存在该问题，是因为没有设置 messages
- 开权限面板 HMR 会提示一大堆 警告信息： https://github.com/gaearon/react-hot-loader/issues/1032
- 图标垂直剧中问题，比如 input 输入框，弹出框 关闭按钮 --- 延后
