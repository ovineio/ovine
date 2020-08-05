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
  defaultCase?: SchemaNode
  cases?: Array<
    SchemaNode & {
      condition?: string
      value?: any
    }
  >
}

@Renderer({
  test: /(^|\/)lib-when$/,
  name: 'lib-when',
})
export class LibWhen extends React.Component<Props> {
  render() {
    const { condition = '', cases, render, defaultCase, data, ifTrue, ifFalse } = this.props

    let schema: any = null

    // with multi cases
    if (cases) {
      schema = cases.find(({ value, condition: itemCondition }) => {
        // get schema by case item condition
        if (itemCondition && evalExpression(itemCondition, data)) {
          return true
        }
        // get schema by case value with main condition
        if (condition && evalJS(condition, data) === value) {
          return true
        }

        return false
      })

      // set defaultCase
      if (!schema && defaultCase) {
        schema = defaultCase
      }
    } else if (ifTrue || ifFalse) {
      // with bool condition
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
