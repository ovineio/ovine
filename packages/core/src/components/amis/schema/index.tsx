import { RendererProps, RenderOptions } from 'amis/lib/factory'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import React, { useMemo } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ThemeConsumer } from 'styled-components'

import { app } from '@/app'

import renderAmis from './amis'
import Code, { containerSelector } from './code'
import { resolveRtSchema, wrapCss } from './func'
import { RtSchema } from './types'

export type AmisProps = {
  schema: RtSchema
  props?: RendererProps
  option?: RenderOptions
}

// 文档 https://baidu.github.io/amis/docs/getting-started
// 源码 https://github.com/baidu/amis/blob/master/examples/components/App.jsx
type Props = AmisProps & RouteComponentProps<any>

export const Amis = withRouter((props: Props) => {
  const { schema, props: amisProps, option = {}, history } = props

  const { preset, type } = schema
  const showCode =
    !app.env.isRelease && (type === 'page' || type === 'rt-crud') && $(containerSelector).length

  const envSchema: RtSchema = useMemo(() => {
    const origin = !showCode ? schema : cloneDeep(schema)
    const cssSchema = wrapCss(origin)
    if (isEmpty(preset)) {
      return cssSchema
    }
    return resolveRtSchema(cssSchema)
  }, [schema])

  return (
    <ThemeConsumer>
      {(theme) => (
        <>
          {renderAmis({
            history,
            theme,
            option,
            props: amisProps,
            schema: envSchema,
          })}
          {showCode && <Code theme={theme.name} schema={schema} />}
        </>
      )}
    </ThemeConsumer>
  )
})
