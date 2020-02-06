import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'

import './rt_crud'
import './rt_css'
import './rt_when'

Renderer({
  test: /(^|\/)rt\-blank$/,
  name: 'rt-blank',
})((props: RendererProps) => {
  const { render, body } = props
  return render('body', body, {})
})

Renderer({
  test: /(^|\/)rt\-omit$/,
  name: 'rt-omit',
})(() => null)
