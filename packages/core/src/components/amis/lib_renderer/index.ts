import { Renderer } from 'amis'

import { RendererProps } from 'amis/lib/factory'

import React from 'react'

import { ObjectOf } from '@/utils/types'

const renderers: ObjectOf<any> = {}

export const addLibRenderer = (key: string, renderer: (props: RendererProps) => any) => {
  renderers[key] = renderer
}

type Props = RendererProps & {
  renderer?: string
}

@Renderer({
  test: /(^|\/)lib-renderer/,
  name: 'lib-renderer',
})
export class LibRenderer extends React.Component<Props> {
  render() {
    const { renderer: key = '', render } = this.props
    const renderer = renderers[key]
    if (!renderer) {
      return null
    }
    return render('body', renderer(this.props))
  }
}
