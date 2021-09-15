---
id: editor
title: 编辑器模块
---

编辑器模块可以提供一个可视化编辑器，在线编辑 JSON，实时预览。

## 添加编辑器功能

> 此功能需要 `yarn add @ovine/editor` 后，需要执行 `yarn dll` 重新静态资源打包

:::info 提示
`@ovine/editor` 包内部封装了 amis 编辑器，不需要再次安装 `amis-editor` 包。
:::

##### 1. 添加路由配置

```ts title="/src/app.auto.js"
//...其他配置
entry: [
  {
    type: 'preset-route', // 路由组件
    path: '/editor', // 可以是其他路由
    pathToComponent: true,
  },
  // ...其他配置
]
//...其他配置
```

##### 2. 添加编辑器页面

```ts title="/src/pages/editor.js"
import React, { useEffect } from 'react'

import { getStore, setStore } from '@core/utils/store'
import { deserialize, serialize } from '@core/utils/tool'
import Editor from '@ovine/editor/lib/index'

const storeKey = 'schemaStore'

const defaultSchema = {
  type: 'page',
  title: '体验在线编辑页面效果～',
  body: '目前只能体验，等完成所有功能后，将可用于生产环境。',
}

const editorOption = {
  breadcrumb: '在线编辑页面',
  getSchema: () => deserialize(getStore<string>(storeKey)) || defaultSchema,
  onSave: (schema) => {
    setStore(storeKey, serialize(schema))
  },
}

export default () => {
  useEffect(() => {
    const { title } = document
    document.title = '正在编辑...'

    return () => {
      document.title = title
    }
  }, [])
  return <Editor {...editorOption} />
}
```

##### 3. 访问编辑器页面 `localhost://7050/editor`

## 为编辑器添加自定义组件

##### 1. 编写 `amis` 自定义组件，并在 `app.auto.js` 入口处引入

```js title="src/renderer/my_renderer.js"
import { Renderer } from 'amis'

@Renderer({
  test: /\bmy-renderer$/,
  name: 'my-renderer',
})
export default class MyRenderer extends React.Component<MyRendererProps> {
  static defaultProps = {
    target: 'world',
  }

  render() {
    const { target } = this.props

    return <p>Hello {target}!</p>
  }
}
```

在 应用入口 `app.auto.js` 处引入

```js title="app.auto.js"
import 'src/renderer/my_renderer'

// 其他代码
```

##### 2. 编辑器注册 自定义组件，并在编辑器页面中引入

```js title="src/renderer/my_renderer_editor.js"
import Editor, { AmisEditor } from '@ovine/editor/lib/index'

export class MyRendererPlugin extends AmisEditor.BasePlugin {
  rendererName = 'my-renderer'

  // 暂时只支持这个，配置后会开启代码编辑器
  $schema = '/schemas/UnkownSchema.json'

  // 用来配置名称和描述
  name = '自定义渲染器'
  description = '这只是个示例'

  // tag，决定会在哪个 tab 下面显示的
  tags = ['自定义', '表单项']

  // 图标
  icon = 'fa fa-user'

  // 用来生成预览图的
  previewSchema = {
    type: 'my-renderer',
    target: 'demo',
  }

  // 拖入组件里面时的初始数据
  scaffold = {
    type: 'my-renderer',
    target: '233',
  }

  // 右侧面板相关
  panelTitle = '自定义组件'
  panelControls = [
    {
      type: 'tabs',
      tabsMode: 'line',
      className: 'm-t-n-xs',
      contentClassName: 'no-border p-l-none p-r-none',
      tabs: [
        {
          title: '常规',
          controls: [
            {
              name: 'target',
              label: 'Target',
              type: 'text',
            },
          ],
        },

        {
          title: '外观',
          controls: [],
        },
      ],
    },
  ]
}

// 编辑器注册自定义组件
AmisEditor.registerEditorPlugin(MyRendererPlugin)
```

在 `src/pages/editor.js` 编辑器页面中引入

```js title="src/pages/editor.js"
import 'src/renderer/my_renderer_editor'

// 其他代码
```
