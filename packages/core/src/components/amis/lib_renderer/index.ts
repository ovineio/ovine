import { Renderer } from 'amis'

import libRenderer from './renderer'

const LibRenderer = (props: any) => {
  const { key, render } = props
  const renderer = libRenderer.getAllRenderers()[key]
  if (!renderer) {
    return null
  }
  return render(renderer(props))
}

Renderer({
  test: /(^\/)lib-rennderer/,
  name: 'lib-renderer',
})(LibRenderer as any)
