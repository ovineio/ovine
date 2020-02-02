/**
 * 空白渲染器，只渲染body
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'

const RtBlank = (props: RendererProps) => {
  const { render, body } = props
  return render('body', body, {})
}

Renderer({
  test: /(^|\/)rt\-blank$/,
  name: 'rt-blank',
})(RtBlank)
