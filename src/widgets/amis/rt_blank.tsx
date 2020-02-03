/**
 * rt-blank 空白渲染器
 * 只渲染body，用于某些 渲染器 key 值冲突的情况，嵌套一层
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
