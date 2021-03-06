/* eslint-disable max-classes-per-file */
/* eslint-disable react/static-property-placement */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React from 'react'

import { AmisEditor } from '@ovine/editor/lib/index'

const { RendererEditor, BasicEditor } = AmisEditor

export interface MyRendererProps extends RendererProps {
  target?: string
}

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

@RendererEditor('my-renderer', {
  name: '自定义渲染器',
  description: '这只是个示例',
  // docLink: '/docs/renderers/Nav',
  type: 'my-renderer',
  previewSchema: {
    // 用来生成预览图的
    type: 'my-renderer',
    target: 'demo',
  },
  scaffold: {
    // 拖入组件里面时的初始数据
    type: 'my-renderer',
    target: '233',
  },
})
export class MyRendererEditor extends BasicEditor {
  tipName = '自定义组件'

  settingsSchema = {
    title: '自定义组件',
    controls: [
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
    ],
  }
}
