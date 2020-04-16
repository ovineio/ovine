import { RendererProps, RenderOptions } from 'amis/lib/factory'
import isEmpty from 'lodash/isEmpty'
import React, { useMemo } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ThemeConsumer } from 'styled-components'

import renderAmis from './amis'
import { resolveLibSchema, wrapCss } from './func'
import { LibSchema } from './types'

export type AmisProps = {
  schema: LibSchema
  props?: RendererProps
  option?: RenderOptions
}

// 文档 https://baidu.github.io/amis/docs/getting-started
// 源码 https://github.com/baidu/amis/blob/master/examples/components/App.jsx
type Props = AmisProps & RouteComponentProps<any>

export const Amis = withRouter((props: Props) => {
  const { schema, props: amisProps, option = {}, history } = props

  const { preset } = schema

  const envSchema: LibSchema = useMemo(() => {
    const cssSchema = wrapCss(schema)
    if (!preset || isEmpty(preset)) {
      return cssSchema
    }
    return resolveLibSchema(cssSchema)
  }, [schema])

  return (
    <ThemeConsumer>
      {(theme) =>
        renderAmis({
          history,
          theme,
          option,
          props: amisProps,
          schema: envSchema,
        })
      }
    </ThemeConsumer>
  )
})
