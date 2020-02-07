import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'

import './rt_crud'
import './rt_css'
import './rt_when'

// 直接渲染 body,内容
// 因为有些情况下，渲染器 key 值冲突，可多加一层嵌套
Renderer({
  name: 'rt-blank',
  test: /(^|\/)rt\-blank$/,
})((props: RendererProps) => {
  const { render, body } = props
  return render('body', body, {})
})

// 由于过滤巨大的 JSON 数据比较麻烦
// 直接定一个过滤渲染器
Renderer({
  name: 'rt-omit',
  test: /(^|\/)rt\-omit$/,
})(() => null)
