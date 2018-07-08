### 问题记录
- vscode js文件 警告不能使用 Decorators
```
\\ .vscode/settiong.json
"javascript.implicitProjectConfig.experimentalDecorators": true
```

- 组件props数据是对象引用，所有环节做的改动会一直存在，不会更新，要重置这个值需要用cloneDeep方法。

### BUG 临时记录

- [x] 每次初始化表格时，请求了两次，需要解决[已解决]
  - 原因：没有仔细考虑Filter与Table各个生命周期，数据的更新，导致Filter,更新buttonKey的时候,重复了。
  - 方案： 讲 tableview，表格初始化，tableLoadType = null，Table 组件 state.tableLoadType = null。 把Filter，在初始化时自动执行一次查询。
- [x] Table.column.render参数，存在性能问题，如果给每个表格项都返回一个组件，会非常卡顿。
  - 解决方案，将 Table.dataSource 传入组件。
- [x] Table.pagniation 存在性能问题，直接注释掉，无卡顿，无论设置成 'false'或者{}, 都会有卡顿。[未解决]
