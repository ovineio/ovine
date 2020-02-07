import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'

import './rt_crud'
import './rt_css'
import './rt_when'

// 直接渲染 schema.body
// 用于 渲染器 key 值冲突时
Renderer({
  name: 'rt-blank',
  test: /(^|\/)rt\-blank$/,
})((props: RendererProps) => {
  const { render, body } = props
  return render('body', body, {})
})

// 动态处理schema时，过滤某个节点组件
Renderer({
  name: 'rt-omit',
  test: /(^|\/)rt\-omit$/,
})(() => null)
