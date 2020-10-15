---
id: renderers
title: 渲染器列表
---

Ovine 页面是通过 Json 配置出来的。这些配置都是由渲染器模型来解析的。灵活掌握这些渲染器配置能够快速写出各种各样的页面。

开始之前，请一定要先阅读 [Amis 渲染器基本用法](https://baidu.github.io/amis/docs/concepts/schema)

### Amis 内置渲染器列表

> 此处可能更新不及时，可以前往 [Amis 官方文档查看](https://baidu.github.io/amis/docs/components/page)

- [Tpl](https://baidu.github.io/amis/docs/components/tpl): 支持用 JS 模板引擎来组织输出
- [Page](https://baidu.github.io/amis/docs/components/page): JSON 配置最外层的 Page 渲染器
- [Action](https://baidu.github.io/amis/docs/components/action): 一种特殊的渲染器，它本身是一个按钮，同时它能触发事件
- [Table](https://baidu.github.io/amis/docs/components/table): 表格展示
  - [Column](https://baidu.github.io/amis/docs/components/column): 表格中的列配置
- [CRUD](https://baidu.github.io/amis/docs/components/crud): 增删改查模型，主要用来展现列表
- [Panel](https://baidu.github.io/amis/docs/components/panel): 可以把相关信息以盒子的形式展示到一块。
- [Form](https://baidu.github.io/amis/docs/components/form/index): 表单渲染器
  - [FormItem](https://baidu.github.io/amis/docs/components/form/formitem): Form 中主要是由各种 FormItem 组成
  - [List](https://baidu.github.io/amis/docs/components/form/list): 简单的列表选择框
  - [Button](https://baidu.github.io/amis/docs/components/button)-Group: 按钮集合
  - [Service](https://baidu.github.io/amis/docs/components/form/service): 动态配置，配置项由接口决定
  - [Tabs](https://baidu.github.io/amis/docs/components/form/tabs): 多个输入框通过选项卡来分组
  - [Table](https://baidu.github.io/amis/docs/components/form/table): 可以用来展示数组类型的数据
  - [HBox](https://baidu.github.io/amis/docs/components/form/hBox): 支持 form 内部再用 HBox 布局
  - [Grid](https://baidu.github.io/amis/docs/components/form/grid): 支持 form 内部再用 grid 布局
  - [Panel](https://baidu.github.io/amis/docs/components/form/panel): 还是为了布局，可以把一部分 FormItem 合并到一个 panel 里面单独展示
  - [Hidden](https://baidu.github.io/amis/docs/components/form/hidden): 隐藏字段类型
  - [Text](https://baidu.github.io/amis/docs/components/form/text): 普通的文本输入框
  - [Textarea](https://baidu.github.io/amis/docs/components/form/textarea): 多行文本输入框
  - [Url](https://baidu.github.io/amis/docs/components/form/url): URL 输入框
  - [Email](https://baidu.github.io/amis/docs/components/form/email): Email 输入框
  - [Password](https://baidu.github.io/amis/docs/components/form/password): 密码输入框
  - [Number](https://baidu.github.io/amis/docs/components/form/number): 数字输入框
  - [Tag](https://baidu.github.io/amis/docs/components/form/tag): 标签输入框
  - [Select](https://baidu.github.io/amis/docs/components/form/select): 选项表单
  - [Chained](https://baidu.github.io/amis/docs/components/chained)-Select: 无限级别下拉
  - [Checkbox](https://baidu.github.io/amis/docs/components/form/checkbox): 勾选框
  - [Checkboxes](https://baidu.github.io/amis/docs/components/form/checkboxes): 复选框
  - [Radios](https://baidu.github.io/amis/docs/components/form/radios): 单选框
  - [City](https://baidu.github.io/amis/docs/components/form/city): 城市选择
  - [Rating](https://baidu.github.io/amis/docs/components/form/rating): 评分
  - [Switch](https://baidu.github.io/amis/docs/components/form/switch): 可选框，和 checkbox 完全等价
  - [Date](https://baidu.github.io/amis/docs/components/form/date): 日期类型
  - [Datetime](https://baidu.github.io/amis/docs/components/form/datetime): 日期时间类型
  - [Time](https://baidu.github.io/amis/docs/components/form/time): 时间类型
  - [Date](https://baidu.github.io/amis/docs/components/date)-Range: 日期范围类型
  - [Transfer](https://baidu.github.io/amis/docs/components/form/transfer): 穿梭器，用来勾选选项。
  - [TabsTransfer](https://baidu.github.io/amis/docs/components/form/tabsTransfer): 组合穿梭器，用来勾选选项。
  - [Color](https://baidu.github.io/amis/docs/components/form/color): 颜色选择器
  - [Range](https://baidu.github.io/amis/docs/components/form/range): 范围输入框
  - [Image](https://baidu.github.io/amis/docs/components/form/image): 图片输入
  - [File](https://baidu.github.io/amis/docs/components/form/file): 文件输入
  - [Matrix](https://baidu.github.io/amis/docs/components/form/matrix): 矩阵类型的输入框
  - [Tree](https://baidu.github.io/amis/docs/components/form/tree): 树形结构输入框
  - [TreeSelect](https://baidu.github.io/amis/docs/components/form/treeselect): 树形结构选择框
  - [NestedSelect](https://baidu.github.io/amis/docs/components/form/nestedselect): 树形结构选择框
  - [Button](https://baidu.github.io/amis/docs/components/form/button): 按钮, 包含 button、submit 和 reset
  - [Button](https://baidu.github.io/amis/docs/components/button-toolbar): 让多个按钮在一起放置
  - [Combo](https://baidu.github.io/amis/docs/components/form/combo): 组合模式
  - [Array](https://baidu.github.io/amis/docs/components/form/array): 数组输入框配置
  - [SubForm](https://baidu.github.io/amis/docs/components/form/subForm): formItem 还可以是子表单类型
  - [Picker](https://baidu.github.io/amis/docs/components/form/picker): 列表选取
  - [Formula](https://baidu.github.io/amis/docs/components/form/formula): 公式类型
  - [Group](https://baidu.github.io/amis/docs/components/form/group): 表单项集合
  - [FieldSet](https://baidu.github.io/amis/docs/components/form/fieldSet): 多个输入框可以通过 fieldSet 捆绑在一起
  - [Repeat](https://baidu.github.io/amis/docs/components/form/eepeat): 可用来设置重复频率
  - [Rich](https://baidu.github.io/amis/docs/components/rich-text): 富文本编辑器
  - [Editor](https://baidu.github.io/amis/docs/components/form/editor): 编辑器
  - [Static](https://baidu.github.io/amis/docs/components/form/static): 纯用来展现数据的
- [Wizard](https://baidu.github.io/amis/docs/components/wizard): 表单向导
- [Each](https://baidu.github.io/amis/docs/components/each): 基于现有变量循环输出渲染器
- [Plain](https://baidu.github.io/amis/docs/components/plain): 单纯的文字输出
- [Html](https://baidu.github.io/amis/docs/components/html): html, 当需要用到变量时，请用 Tpl 代替
- [Dialog](https://baidu.github.io/amis/docs/components/dialog): Dialog 由 Action 触发。他是一个类似于 Page 的容器模型
- [Drawer](https://baidu.github.io/amis/docs/components/drawer): Drawer 由 Action 触发
- [Divider](https://baidu.github.io/amis/docs/components/divider): 分割线
- [Wrapper](https://baidu.github.io/amis/docs/components/wrapper): 简单的一个容器。
- [Service](https://baidu.github.io/amis/docs/components/service): 功能型容器，自身不负责展示内容，主要职责在于通过配置的 api 拉取数据
- [Chart](https://baidu.github.io/amis/docs/components/chart): 图表渲染器
- [Collapse](https://baidu.github.io/amis/docs/components/collapse): 折叠器
- [Carousel](https://baidu.github.io/amis/docs/components/carousel): 轮播图
- [Alert](https://baidu.github.io/amis/docs/components/alert): 提示框
- [Audio](https://baidu.github.io/amis/docs/components/audio): 音频播放器
- [Video](https://baidu.github.io/amis/docs/components/video): 视频播放器
- [List](https://baidu.github.io/amis/docs/components/list): 列表展示
- [Card](https://baidu.github.io/amis/docs/components/card): 卡片的展示形式
- [Cards](https://baidu.github.io/amis/docs/components/cards): 卡片集合
- [Field](https://baidu.github.io/amis/docs/components/field): 主要用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中
- [Tabs](https://baidu.github.io/amis/docs/components/tabs): 标签页
- [Grid](https://baidu.github.io/amis/docs/components/grid): Grid 布局
- [HBox](https://baidu.github.io/amis/docs/components/hbox): HBox 布局
- [iFrame](https://baidu.github.io/amis/docs/components/iframe)： 如果需要内嵌外部站点，可用 iframe 来实现
- [Nav](https://baidu.github.io/amis/docs/components/nav): 菜单栏
- [Tasks](https://baidu.github.io/amis/docs/components/tasks): 任务操作集合，类似于 orp 上线
- [QRCode](https://baidu.github.io/amis/docs/components/qrcode): 二维码显示组件
- [Types](https://baidu.github.io/amis/docs/components/types): 类型说明文档

### Ovine 扩展渲染器列表

以下是 Ovine 封装的一些渲染器，均在 Demo 项目中有使用到。扩展的渲染器都是 `lib-xxx` 前缀。建议应用内扩展可以使用 `app-xxx`。当渲染器过多时，可以迅速去对应的地方找到文档。

- [lib-css](#lib-css): 添加 Css 自定义样
- [lib-crud](#lib-crud): 封装了 Amis Crud 渲染器，更加紧凑，适合表格页面
- [lib-dropdown](#lib-dropdown): 下拉选择框
- [lib-limit-setting](#lib-limit-setting): 权限控制面板
- [lib-renderer](#lib-renderer): 扩展简单渲染器
- [lib-when](#lib-when): 条件渲染
- [lib-blank](#lib-blank): 不渲染当前节点，但渲染子节点
- [lib-omit](#lib-omit): 不渲染当前节点及子节点

#### lib-css

样式渲染器，可以方便的给组件添加样式，支持定义好的主题变量。建议在 JSON 最顶层使用一次该渲染器即可，无需在每个需要自定义样式的组件都写一次。[查看样式写法](https://styled-components.com/)

```ts
type Props = {
  css?: string | CssType // 样式字符串
  htmlClassName?: string // 页面样式
  tag?: keyof JSX.IntrinsicElements | React.ComponentType<any> // 当前组件的 tagName
}

// 普通 css 的写法
{
  css: `
    .xxx {
      background: color;
    }
  `
}

// 需要主题变量的 css 写法
{
  css: (theme) => `
    .${theme.ns}xxx {
      background: color;
    }
  `
}
```

#### lib-dropdown

极简的一个下拉列表，主要用于有鼠标悬浮展示下拉菜单场景的地方。

```ts
type Props = {
  items?: AmisSchema[] // 控制下拉的一些菜单项，基本是 amis actions渲染器组成。
  hover?: {
    // 控制鼠标悬浮的一些参数,
    // 文档 https://github.com/briancherne/jquery-hoverIntent
    sensitivity: number
    interval: number
    timeout: number
  }
  body?: AmisSchema // 下拉列表的内容
}

// 使用举例
{
  type: 'lib-dropdown',
  body: {
    type: 'button',
    iconOnly: true,
    icon: 'fa fa-code',
    level: 'link',
  },
  items: [
    {
      type: 'button',
      level: 'link',
      icon: 'fa fa-file-code-o',
      label: '本页面JSON',
    },
    {
      type: 'button',
      level: 'link',
      icon: 'fa fa-code-fork',
      label: 'APP路由配置',
    },
    {
      type: 'button',
      level: 'link',
      icon: 'fa fa-unlock',
      label: '当前拥有权限',
    },
  ],
}
```

#### lib-limit-setting

权限控制面板渲染器。主要是用于，将展示所有可供操作的权限，并将用户选择的权限提交给后端。

```ts
type Porps = {
  limit?: string // 权限字符串，可有 initApi 获取
  saveConfirmText?: string // 保存权限时的提示
  className?: string // 样式
  initApi?: ReqOption // 获取权限的 api
  api?: ReqOption // 保存权限的 api
  useAllLimit?: boolean // 应用所有权限，默认为 false
  reload?: boolean // 提交成功是否需要刷新 table
  messages?: { // 接口消息提示
    initFailed: string // 初始化失败的提示
    saveFailed: string // 保存失败的提示
    saveSuccess: string // 保存成功的提示
  }
  button?: AmisSchema // 权限按钮。 amis 的 Action 渲染器
  modal?: AmisSchema // 权限弹框。amis 的 Dialog 渲染器
  getLimit?: () => string
  onSave?: (authLimitData: AuthLimitData) => void // 保存时的回调
  onCancel?: () => void // 取消时的回调
}

type AuthLimitData = {
  authApi: string // 所有的接口字符串数组
  authLimit: string // 所有的前端权限字符串数组
}

// initApi 接口返回格式要求
{
  data: {
    limit: 'xxx' // 保存时的，提交给后端的 authLimit 字段值。
  }
}

// 使用举例
{
  initApi: '$preset.apis.getLimit',
  api: '$preset.apis.editLimit',
  type: 'lib-limit-setting',
  saveConfirmText: '您正在修改的角色是【$name】，提交后将不可重置，是否确认提交？',
  button: {
    actionType: 'drawer',
    iconOnly: true,
    icon: 'fa fa-unlock-alt',
    level: 'link',
    label: '',
    tooltip: '编辑权限',
  },
  modal: {
    postion: 'right',
    resizable: true,
    className: 'hide-close-button',
  },
}
```

#### lib-renderer

主要用于封装一些全局的简单渲染器，只需要参数，就就能转换为其他的 JSON 渲染器的场景。

```ts
// 注册一个 lib-renderer
import { addLibRenderer } from '@core/components/amis/lib_renderer'

// userInfoModal 渲染器, 可以方便全局使用
addLibRenderer('userInfoModal', ({ id }) => ({
  type: 'action',
  level: 'link',
  label: '查看用户信息',
  className: 'no-shadow',
  actionType: 'dialog',
  dialog: {
    title: '系统用户信息',
     body: {
        type: 'service',
        api: `api/${id}`,
        body: {
            type: 'form',
            controls: [{
              type: 'text',
              name: 'nickname',
              label: '名称',
            }]
        }
     }
  }
})

// 使用 lib-renderer
{
  type: 'lib-renderer',
  renderer: 'userInfoModal', // 为注册的渲染 key
  id: '123'
}
```

#### lib-when

条件渲染器，主要用于需要根据数据动态显示不同内容地方。

```ts
type Props = {
  condition?: string // 条件表达式 类似 amis 的，disabledOn 等表达式。
  ifTrue?: AmisSchema // 结果 === true 的 Schema
  ifFalse?: SchemaNode // 结果 === false 的 Schema
  defaultCase?: SchemaNode // 所有 cases 都不满足默认时的，仅对 cases 有效 Schema
  cases?: Array<
    // 如果表达式时不是 true/false 时，需要配置不同场景渲染
    SchemaNode & {
      value?: any // 当主表达式 === value 时，需要渲染的JSON内容
      condition?: string // 当前 case 表达式，为 true 时渲染
    }
  >
}

// 使用举例，是否存在 data.a 进行不同显示
{
  condition: 'data.a',
  ifTrue: {
    type: 'button',
    label: '按钮'
  },
  ifFalse: {
    type: 'html',
    html: '-'
  },
}

// 使用举例, 根据 data.a 值不同的结果进行渲染
{
  condition: 'data.a',
  cases:[{
    value: '1',
     type: 'button',
    label: '情况1'
  },{
    value: '2',
    type: 'html',
    html: '情况2'
  }]
}
```

#### lib-blank

直接渲染 schema.body, 用于渲染器存在 key 值冲突时，很少情况下会使用。

````ts
// 举例， table 列配置中，需要 label 表示，列名。但是列里面需要显示一个按钮。按钮也需要 label 表示，按钮名。因此存在冲突。
{
  type: 'lib-blank',
  label: '列名',
  body: {
    type: 'button',
    label: '按钮名'
  },
}
``

#### lib-crud

```ts
````

#### lib-omit

动态处理 schema 时，过滤某个节点组件。这个用的很少，主要是 lib 中有使用到。

### 特定场景中使用的渲染器

> 由于配置较多，也是 Ovine 项目都必要用的渲染器，因此具体使用请查看 [Demo](https://github.com/CareyToboo/ovine/tree/master/website/example) 代码。

#### 页面配置中 entry 中可配置的渲染器

---

- `preset-route` 经过封装的路由

```ts
type Props = {
  path?: string // 真实页面路由
  nodePath: string // 节点路径
  pathToComponent?: boolean | string // 路由对应 pages 文件目录下的路径，懒加载时候有效
  withSuspense?: boolean // 是否需要 Suspense 包装
  fallback?: any // 懒加载文件时占位
  component?: React.Component // 路由节点组件（非懒加载路由）
  exact?: boolean // 完全匹配路由
  sensitive?: boolean // 是否大小写敏感
  strict?: boolean // 是否校验末尾 “
  children?: any // 子组件
}
```

- `private-route` 用于鉴权的路由

```ts

type Props = {
  onAuth: boolean | Promise<Boolean> | () => boolean // 认证回调
  redirect: string // 认证失败回跳路由
  path?: string // 真实页面路由
  component?: React.Component // 路由节点组件（非懒加载路由）
  exact?: boolean // 完全匹配路由
  sensitive?: boolean // 是否大小写敏感
  strict?: boolean // 是否校验末尾
  children?: any // 子组件
}

```

- `aside-layout` 侧边栏布局
  [route 路由配置](/org/docs/advance/configurations#路由配置)

```ts
type Props = {
  routeTabs?: {
    enable?: boolean // 是否开启 ”路由选项卡“
    maxCount?: number // 选项卡 最多个数限制
    storage?: boolean // 是否 开启前端本地存储
  }
  header?: {
    // 头部配置
    brand: {
      // 公司品牌
      logo: string // LOGO
      title: string // 公司名
      className?: string // 样式
      link?: {
        // 是否需要点击调转
        title?: string // 链接显示提示文案
        href: string // 跳转地址
      }
    }
    showDevItems?: boolean // 是否在开发时 显示查看代码按钮
    items?: any[] // 头部工具项
  }
  footer?: AmisSchema // 任何 Amis 支持的配置
  routes?: RouteItem[] // 路由配置组成的数组
  children?: any // 子组件
}
```

- `amis-render` amis 渲染器,可使用任何 amis 的渲染器

#### `aside-layout` 中 `header.items` 可配置的渲染器

---

- `head-item` 普通的头部工具项

```ts
type Props = {
  className?: string // 样式
  icon?: string // 需要显示的图标
  faIcon?: string // font-awesome 图标，会字符串拼接`fa fa-${faIcon}`
  tip?: string // 提示文案
  onClick?: any // 点击事件
  href?: string // 需要跳转的链接
  body?: AmisSchema // 任何 Amis Json
  children?: any // 子组件
}
```

- `item-search-menu` 搜索侧边栏按钮

```ts
type Props = {
  align?: 'left' | 'right' // 图标的排列方式
}
```

- `item-setting` 系统设置按钮

```ts
type Props = {
  align?: 'left' | 'right' // 图标的排列方式
}
```

- `item-dev-code` 显示配置代码按钮

```ts
type Props = {
  align?: 'left' | 'right' // 图标的排列方式
}
```
