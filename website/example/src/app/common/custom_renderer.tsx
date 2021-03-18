/* eslint-disable max-classes-per-file */
/* eslint-disable react/static-property-placement */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React from 'react'

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
