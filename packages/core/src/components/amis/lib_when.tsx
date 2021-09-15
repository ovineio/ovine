/**
 * lib-when 条件渲染器
 * 用于不同条件，渲染不同组件的情况
 */

import { RendererProps, Renderer } from 'amis/lib/factory'
import { SchemaNode } from 'amis/lib/types'
import { evalJS } from 'amis/lib/utils/tpl'
import { isFunction } from 'lodash'
import React from 'react'

interface Props extends RendererProps {
  condition?: string | Function
  ifTrue?: SchemaNode
  ifFalse?: SchemaNode
  defaultCase?: SchemaNode
  cases?: Array<
    SchemaNode & {
      condition?: string | Function
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
    const { render, data, condition = '', cases, defaultCase, ifTrue, ifFalse } = this.props

    let schema: any = null

    const getResult = (con: any, value: any, source: any) => {
      const result = isFunction(con) ? con(value, source) : con

      if (typeof result === 'boolean') {
        return result
      }

      if (result && typeof result === 'string') {
        return evalJS(result, source) === value
      }

      return !!result
    }

    // with multi cases
    if (cases) {
      schema = cases.find((item) => {
        const { value, condition: itemCon } = item
        // get schema by case item condition
        return getResult(itemCon || condition, value, data)
      })

      // set defaultCase
      if (!schema && defaultCase) {
        schema = defaultCase
      }
    } else if (ifTrue || ifFalse) {
      // with bool condition
      const result = getResult(condition, !!ifTrue, data)
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
