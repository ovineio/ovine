/**
 * lib-when 条件渲染器
 * 用于不同条件，渲染不同组件的情况
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import { SchemaNode } from 'amis/lib/types'
import { evalExpression, evalJS } from 'amis/lib/utils/tpl'

type Props = RendererProps & {
  condition: string
  ifTrue?: SchemaNode
  ifFalse?: SchemaNode
  cases?: Array<
    SchemaNode & {
      value: any
    }
  >
}

const LibWhen = (props: Props) => {
  const { condition, cases, render, data, ifTrue, ifFalse } = props

  let schema: any = null

  if (cases) {
    schema = cases.find(({ value }) => value === evalJS(condition, data))
    //
  } else if (ifTrue || ifFalse) {
    const result = evalExpression(condition, data)
    if (result && ifTrue) {
      schema = ifTrue
    }
    if (!result && ifFalse) {
      schema = ifFalse
    }
  }

  return !schema ? null : render('body', schema)
}

Renderer({
  test: /(^|\/)lib-when$/,
  name: 'lib-when',
})(LibWhen as any)
