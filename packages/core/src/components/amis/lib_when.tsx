/**
 * lib-when 条件渲染器
 * 用于不同条件，渲染不同组件的情况
 */

import { RendererProps, Renderer } from 'amis/lib/factory'
import { SchemaNode } from 'amis/lib/types'
import { evalExpression, evalJS } from 'amis/lib/utils/tpl'
import React from 'react'

interface Props extends RendererProps {
  condition?: string
  ifTrue?: SchemaNode
  ifFalse?: SchemaNode
  cases?: Array<
    SchemaNode & {
      value: any
    }
  >
}

@Renderer({
  test: /(^|\/)lib-when$/,
  name: 'lib-when',
})
export class LibWhen extends React.Component<Props> {
  render() {
    const { condition = '', cases, render, data, ifTrue, ifFalse } = this.props

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
}
