import { Renderer } from 'amis'

import { RendererProps } from 'amis/lib/factory'

import { ObjectOf } from '@/utils/types'

const renderers: ObjectOf<any> = {}

export const libRenderer = {
  getAllRenderers: () => renderers,
  register: (key: any, renderer: (props: RendererProps) => any) => {
    renderers[key] = renderer
  },
}

const LibRenderer = (props: RendererProps) => {
  const { renderer: key, render } = props
  const renderer = renderers[key]
  if (!renderer) {
    return null
  }
  return render('body', renderer(props))
}

Renderer({
  test: /(^|\/)lib-renderer/,
  name: 'lib-renderer',
})(LibRenderer as any)
