import { RendererProps, RenderOptions } from 'amis/lib/factory'
import { isEmpty, cloneDeep, isObject } from 'lodash'
import React, { useMemo, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ThemeConsumer } from 'styled-components'

import { app } from '@/app'
import { storage } from '@/constants'
import { getGlobal, setGlobal } from '@/utils/store'

import renderAmis from './amis'
import { resolveLibSchema, wrapCss } from './func'
import { LibSchema } from './types'

export type AmisProps = {
  schema: LibSchema
  props?: RendererProps
  option?: RenderOptions
}

// 文档 https://baidu.github.io/amis/docs/start/getting-started
// 源码 https://github.com/baidu/amis/blob/master/examples/components/App.jsx
type Props = AmisProps & RouteComponentProps<any>

export const Amis = withRouter((props: Props) => {
  const { schema: rawSchema, props: amisProps, option = {}, history } = props
  const codeStore = getGlobal<any>(storage.dev.code) || {}

  useEffect(() => {
    return () => {
      if (codeStore.enable) {
        setGlobal(storage.dev.code, {
          enable: true,
          schema: false,
        })
      }
    }
  }, [])

  const envSchema: LibSchema = useMemo(() => {
    if (!rawSchema || !isObject(rawSchema) || isEmpty(rawSchema)) {
      return {
        type: 'html',
        html: '请传入有效schema',
      }
    }

    // Avoid modify rawSchema of props
    const schema = cloneDeep({
      ...rawSchema,
      // Merge amis global definitions
      definitions: {
        ...app.amis.definitions,
        ...rawSchema.definitions,
      },
    })

    const libSchema = resolveLibSchema(wrapCss(schema))

    if (codeStore.enable) {
      setGlobal(storage.dev.code, {
        enable: true,
        schema: libSchema,
      })
    }
    return libSchema
  }, [rawSchema])

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
