import { RendererProps, RenderOptions } from 'amis/lib/factory'
import { isEmpty, cloneDeep, isObject } from 'lodash'
import React, { useMemo, useEffect } from 'react'
import { ThemeConsumer } from 'styled-components'

import { app } from '@/app'
import { useAppContext } from '@/components/app/context'
import { storage } from '@/constants'
import { getGlobal, setGlobal } from '@/utils/store'

import AmisComponent from './amis'
import { resolveLibSchema, wrapCss } from './func'
import { LibSchema } from './types'

export type AmisProps = {
  schema: LibSchema
  props?: Partial<
    RendererProps & {
      affixOffsetTop: boolean
    }
  >
  option?: RenderOptions
}

// 源码 https://github.com/baidu/amis/blob/master/examples/components/App.jsx

export const Amis = (props: AmisProps) => {
  const { schema: rawSchema, props: amisProps = {}, option = {} } = props
  const codeStore = getGlobal<any>(storage.dev.code) || {}

  const { enableRouteTabs, locale } = useAppContext()

  // 改变固定的高度
  // @ts-ignore
  if (!amisProps.affixOffsetTop && getGlobal(storage.supportRouteTabs)) {
    // @ts-ignore
    amisProps.affixOffsetTop = enableRouteTabs ? 100 : 50
  }

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
        html: '请传入有效的 schema',
      }
    }

    // Avoid modify rawSchema of props
    const schema = cloneDeep({
      ...rawSchema,
      // Merge amis global definitions
      constants: app.amis.constants,
      definitions: {
        ...app.amis.definitions,
        ...rawSchema.definitions,
      },
    })

    const libSchema = resolveLibSchema(wrapCss(schema))

    if (codeStore.enable && schema.type === 'page') {
      setGlobal(storage.dev.code, {
        enable: true,
        schema: libSchema,
      })
    }
    return libSchema
  }, [rawSchema])

  return (
    <ThemeConsumer>
      {(theme) => (
        <AmisComponent
          key={theme.name}
          option={{
            ...option,
            theme: theme.name,
            locale,
          }}
          schema={envSchema}
          props={amisProps}
        />
      )}
    </ThemeConsumer>
  )
}
