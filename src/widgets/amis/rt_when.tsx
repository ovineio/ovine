/**
 * rt-when 条件渲染器
 * 用于不同条件，渲染不同组件的情况
 */

import { Renderer } from 'amis'
import { RendererComponent, RendererProps } from 'amis/lib/factory'
import { SchemaNode } from 'amis/lib/types'
import { filter } from 'amis/lib/utils/tpl'

type Props = RendererProps & {
  condition: string
  cases: Array<
    SchemaNode & {
      value: any
    }
  >
}
const RtWhen = (props: Props) => {
  const { condition, cases, render, data } = props

  const schema = cases.find(({ value }) => value === filter(condition, data))

  return !schema ? null : render('body', schema)
}

Renderer({
  test: /(^|\/)rt\-when$/,
  name: 'rt-when',
})(RtWhen as RendererComponent)
