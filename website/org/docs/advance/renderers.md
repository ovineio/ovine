---
id: renderers
title: 渲染器列表
---

Ovine 页面是通过 Json 配置出来的。这些配置都是由渲染器模型来解析的。灵活掌握这些渲染器配置能够快速写出各种各样的页面。

开始之前，请您一定要先阅读 [Amis 渲染器基本用法](https://baidu.github.io/amis/docs/basic?perPage=5&page=1)

### Amis 内置渲染器列表

> 此处可能更新不及时，可以前往 [Amis 官方文档查看](https://baidu.github.io/amis/docs/renderers)

- [Definitions](https://baidu.github.io/amis/docs/renderers/Definitions): 建立当前页面公共的配置项
- [Tpl](https://baidu.github.io/amis/docs/renderers/Tpl): 支持用 JS 模板引擎来组织输出
- [Page](https://baidu.github.io/amis/docs/renderers/Page): JSON 配置最外层的 Page 渲染器
- [Action](https://baidu.github.io/amis/docs/renderers/Action): 一种特殊的渲染器，它本身是一个按钮，同时它能触发事件
- [Table](https://baidu.github.io/amis/docs/renderers/Table): 表格展示
  - [Column](https://baidu.github.io/amis/docs/renderers/Column): 表格中的列配置
- [CRUD](https://baidu.github.io/amis/docs/renderers/CRUD): 增删改查模型，主要用来展现列表
  - [CRUD-Table](https://baidu.github.io/amis/docs/renderers/CRUD-Table): 请参考 Table
  - [CRUD-Cards](https://baidu.github.io/amis/docs/renderers/CRUD-Cards): 请参考 Cards
  - [CRUD-List](https://baidu.github.io/amis/docs/renderers/CRUD-List): 请参考 List
- [Panel](https://baidu.github.io/amis/docs/renderers/Panel): 可以把相关信息以盒子的形式展示到一块。
- [Form](https://baidu.github.io/amis/docs/renderers/Form/Form): 表单渲染器
  - [FormItem](https://baidu.github.io/amis/docs/renderers/Form/FormItem): Form 中主要是由各种 FormItem 组成
  - [List](https://baidu.github.io/amis/docs/renderers/Form/List): 简单的列表选择框
  - [Button](https://baidu.github.io/amis/docs/renderers/Button)-Group: 按钮集合
  - [Service](https://baidu.github.io/amis/docs/renderers/Form/Service): 动态配置，配置项由接口决定
  - [Tabs](https://baidu.github.io/amis/docs/renderers/Form/Tabs): 多个输入框通过选项卡来分组
  - [Table](https://baidu.github.io/amis/docs/renderers/Form/Table): 可以用来展示数组类型的数据
  - [HBox](https://baidu.github.io/amis/docs/renderers/Form/HBox): 支持 form 内部再用 HBox 布局
  - [Grid](https://baidu.github.io/amis/docs/renderers/Form/Grid): 支持 form 内部再用 grid 布局
  - [Panel](https://baidu.github.io/amis/docs/renderers/Form/Panel): 还是为了布局，可以把一部分 FormItem 合并到一个 panel 里面单独展示
  - [Hidden](https://baidu.github.io/amis/docs/renderers/Form/Hidden): 隐藏字段类型
  - [Text](https://baidu.github.io/amis/docs/renderers/Form/Text): 普通的文本输入框
  - [Textarea](https://baidu.github.io/amis/docs/renderers/Form/Textarea): 多行文本输入框
  - [Url](https://baidu.github.io/amis/docs/renderers/Form/Url): URL 输入框
  - [Email](https://baidu.github.io/amis/docs/renderers/Form/Email): Email 输入框
  - [Password](https://baidu.github.io/amis/docs/renderers/Form/Password): 密码输入框
  - [Number](https://baidu.github.io/amis/docs/renderers/Form/Number): 数字输入框
  - [Tag](https://baidu.github.io/amis/docs/renderers/Form/Tag): 标签输入框
  - [Select](https://baidu.github.io/amis/docs/renderers/Form/Select): 选项表单
  - [Chained](https://baidu.github.io/amis/docs/renderers/Chained)-Select: 无限级别下拉
  - [Checkbox](https://baidu.github.io/amis/docs/renderers/Form/Checkbox): 勾选框
  - [Checkboxes](https://baidu.github.io/amis/docs/renderers/Form/Checkboxes): 复选框
  - [Radios](https://baidu.github.io/amis/docs/renderers/Form/Radios): 单选框
  - [City](https://baidu.github.io/amis/docs/renderers/Form/City): 城市选择
  - [Rating](https://baidu.github.io/amis/docs/renderers/Form/Rating): 评分
  - [Switch](https://baidu.github.io/amis/docs/renderers/Form/Switch): 可选框，和 checkbox 完全等价
  - [Date](https://baidu.github.io/amis/docs/renderers/Form/Date): 日期类型
  - [Datetime](https://baidu.github.io/amis/docs/renderers/Form/Datetime): 日期时间类型
  - [Time](https://baidu.github.io/amis/docs/renderers/Form/Time): 时间类型
  - [Date](https://baidu.github.io/amis/docs/renderers/Date)-Range: 日期范围类型
  - [Transfer](https://baidu.github.io/amis/docs/renderers/Form/Transfer): 穿梭器，用来勾选选项。
  - [TabsTransfer](https://baidu.github.io/amis/docs/renderers/Form/TabsTransfer): 组合穿梭器，用来勾选选项。
  - [Color](https://baidu.github.io/amis/docs/renderers/Form/Color): 颜色选择器
  - [Range](https://baidu.github.io/amis/docs/renderers/Form/Range): 范围输入框
  - [Image](https://baidu.github.io/amis/docs/renderers/Form/Image): 图片输入
  - [File](https://baidu.github.io/amis/docs/renderers/Form/File): 文件输入
  - [Matrix](https://baidu.github.io/amis/docs/renderers/Form/Matrix): 矩阵类型的输入框
  - [Tree](https://baidu.github.io/amis/docs/renderers/Form/Tree): 树形结构输入框
  - [TreeSelect](https://baidu.github.io/amis/docs/renderers/Form/TreeSelect): 树形结构选择框
  - [NestedSelect](https://baidu.github.io/amis/docs/renderers/Form/NestedSelect): 树形结构选择框
  - [Button](https://baidu.github.io/amis/docs/renderers/Form/Button): 按钮, 包含 button、submit 和 reset
  - [Button](https://baidu.github.io/amis/docs/renderers/Button)-Toolbar: 让多个按钮在一起放置
  - [Combo](https://baidu.github.io/amis/docs/renderers/Form/Combo): 组合模式
  - [Array](https://baidu.github.io/amis/docs/renderers/Form/Array): 数组输入框配置
  - [SubForm](https://baidu.github.io/amis/docs/renderers/Form/SubForm): formItem 还可以是子表单类型
  - [Picker](https://baidu.github.io/amis/docs/renderers/Form/Picker): 列表选取
  - [Formula](https://baidu.github.io/amis/docs/renderers/Form/Formula): 公式类型
  - [Group](https://baidu.github.io/amis/docs/renderers/Form/Group): 表单项集合
  - [FieldSet](https://baidu.github.io/amis/docs/renderers/Form/FieldSet): 多个输入框可以通过 fieldSet 捆绑在一起
  - [Repeat](https://baidu.github.io/amis/docs/renderers/Form/Repeat): 可用来设置重复频率
  - [Rich](https://baidu.github.io/amis/docs/renderers/Rich)-Text: 富文本编辑器
  - [Editor](https://baidu.github.io/amis/docs/renderers/Form/Editor): 编辑器
  - [Static](https://baidu.github.io/amis/docs/renderers/Form/Static): 纯用来展现数据的
- [Wizard](https://baidu.github.io/amis/docs/renderers/Wizard): 表单向导
- [Each](https://baidu.github.io/amis/docs/renderers/Each): 基于现有变量循环输出渲染器
- [Plain](https://baidu.github.io/amis/docs/renderers/Plain): 单纯的文字输出
- [Html](https://baidu.github.io/amis/docs/renderers/Html): html, 当需要用到变量时，请用 Tpl 代替
- [Dialog](https://baidu.github.io/amis/docs/renderers/Dialog): Dialog 由 Action 触发。他是一个类似于 Page 的容器模型
- [Drawer](https://baidu.github.io/amis/docs/renderers/Drawer): Drawer 由 Action 触发
- [Divider](https://baidu.github.io/amis/docs/renderers/Divider): 分割线
- [Wrapper](https://baidu.github.io/amis/docs/renderers/Wrapper): 简单的一个容器。
- [Service](https://baidu.github.io/amis/docs/renderers/Service): 功能型容器，自身不负责展示内容，主要职责在于通过配置的 api 拉取数据
- [Chart](https://baidu.github.io/amis/docs/renderers/Chart): 图表渲染器
- [Collapse](https://baidu.github.io/amis/docs/renderers/Collapse): 折叠器
- [Carousel](https://baidu.github.io/amis/docs/renderers/Carousel): 轮播图
- [Alert](https://baidu.github.io/amis/docs/renderers/Alert): 提示框
- [Audio](https://baidu.github.io/amis/docs/renderers/Audio): 音频播放器
- [Video](https://baidu.github.io/amis/docs/renderers/Video): 视频播放器
- [List](https://baidu.github.io/amis/docs/renderers/List): 列表展示
- [Card](https://baidu.github.io/amis/docs/renderers/Card): 卡片的展示形式
- [Cards](https://baidu.github.io/amis/docs/renderers/Cards): 卡片集合
- [Field](https://baidu.github.io/amis/docs/renderers/Field): 主要用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中
- [Tabs](https://baidu.github.io/amis/docs/renderers/Tabs): 标签页
- [Grid](https://baidu.github.io/amis/docs/renderers/Grid): Grid 布局
- [HBox](https://baidu.github.io/amis/docs/renderers/HBox): HBox 布局
- iFrame： 如果需要内嵌外部站点，可用 iframe 来实现
- [Nav](https://baidu.github.io/amis/docs/renderers/Nav): 菜单栏
- [Tasks](https://baidu.github.io/amis/docs/renderers/Tasks): 任务操作集合，类似于 orp 上线
- [QRCode](https://baidu.github.io/amis/docs/renderers/QRCode): 二维码显示组件
- [Types](https://baidu.github.io/amis/docs/renderers/Types): 类型说明文档

### Ovine 扩展渲染器列表

扩展的渲染器都是 `lib-xxx` 前缀。建议应用内扩展可以使用 `app-xxx`。当渲染器过多时，可以迅速去对应的地方找到文档。

- [lib-css](#lib-css): 添加 Css 自定义样
- [lib-crud](#lib-crud): 封装了 Amis Crud 渲染器，更加紧凑，适合表格页面
- [lib-dropdown](#lib-dropdown): 下拉选择框
- [lib-limit-setting](#lib-limit-setting): 权限控制面板
- [lib-renderer](#lib-renderer): 扩展简单渲染器
- [lib-when](#lib-when): 条件渲染
- [lib-blank](#lib-blank): 不渲染当前节点，但渲染子节点
- [lib-omit](#lib-omit): 不渲染当前节点及子节点

### 其他渲染器

#### 页面配置中 entry 中可配置的渲染器

- `preset-route` 经过封装的普通路由

```

```

- `private-route` 用于登陆鉴权的路由

```

```

- `aside-layout` 侧边栏布局

```

```

- `amis-render` amis 渲染器,可使用任何 amis 的渲染器

#### `aside-layout` 中 items 可配置的渲染器

- `head-item` 普通的头部项

```

```

- `item-search-menu` 搜索侧边栏

```

```

- `item-setting` 系统设置

```

```

- `item-dev-code` 显示配置代码

```

```

#### lib-css

```

```

#### lib-crud

```

```

#### lib-dropdown

```

```

#### lib-limit-setting

```

```

#### lib-renderer

```

```

#### lib-when

```

```

#### lib-blank

```

```

#### lib-omit

```

```
