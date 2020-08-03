/**
 * 自定义amis渲染器
 */

import React, { Component } from 'react'
import { Renderer, RendererProps } from 'amis/lib/factory'

@Renderer({
  test: /(^|\/)my\-renderer$/,
  name: 'my-renderer',
})
export class CustomRenderer extends Component<RendererProps> {
  render() {
    const { tip, body, render } = this.props
    return (
      <div>
        <p>这是自定义amis渲染器：{tip}</p>
        {body ? (
          <div className="container">
            {render('body', body, {
              // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
            })}
          </div>
        ) : null}
      </div>
    )
  }
}
