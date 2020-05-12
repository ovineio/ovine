import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'

import './lib_crud'
import './lib_css'
import './lib_when'
import './lib_dropdown'
import './lib_renderer'

// TODO: 添加 table-cell 文字折叠展示
// TODO: 添加 lib-limit-setting 渲染器

// 直接渲染 schema.body, 用于 渲染器 key 值冲突时
Renderer({
  name: 'lib-blank',
  test: /(^|\/)lib-blank$/,
})((props: RendererProps) => {
  const { render, body } = props
  return render('body', body, {})
})

// 动态处理schema时，过滤某个节点组件
Renderer({
  name: 'lib-omit',
  test: /(^|\/)lib-omit$/,
})(() => null)
