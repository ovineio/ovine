import { Drawer, Spinner } from 'amis'
import { Editor } from 'amis/lib/components'
import { RendererProps } from 'amis/lib/factory'
import { cloneDeep, isObject, isFunction, map } from 'lodash'
import React, { useState, useRef, useMemo } from 'react'

import { storage } from '@/constants'
import { getRouteConfig } from '@/routes/config'
import { getStore } from '@/utils/store'
import { ObjectOf } from '@/utils/types'

type CodeType = 'route' | 'page' | 'limit'

export default (props: RendererProps) => {
  const { render, theme } = props

  const [show, toggle] = useState(false)
  const [code, setCode] = useState<CodeType>('page')
  const [loading, toggleLoading] = useState(false)

  const storeRef = useRef<ObjectOf<any>>({})

  const toggleDrawer = () => toggle((t) => !t)

  const onEditorMounted = () => {
    if (loading && (window as any).monaco) {
      toggleLoading(false)
    }
  }

  const cachedSchema = useMemo(() => {
    let json: any = {}
    if (storeRef.current[code]) {
      return storeRef.current[code]
    }
    switch (code) {
      // case 'page':
      //   json = cloneDeep(schema)
      //   transSchema(json)
      //   break
      case 'route':
        json = cloneDeep(getRouteConfig())
        transSchema(json)
        break
      case 'limit':
        json = {
          authLimits: getStore<string>(storage.dev.limit)?.split(','),
          authApis: getStore<string>(storage.dev.api)?.split(','),
        }
        break
      default:
    }
    const jsonStr = JSON.stringify(json)
    storeRef.current[code] = jsonStr
    return jsonStr
  }, [code])

  const viewCode = (codeType: CodeType) => {
    setCode(codeType)
    toggleDrawer()
  }

  const dropDownSchema = {
    type: 'lib-dropdown',
    body: {
      type: 'button',
      iconOnly: true,
      icon: 'fa fa-code',
      level: 'link',
      className: 'h-full',
    },
    items: [
      {
        type: 'button',
        level: 'link',
        icon: 'fa fa-file-code-o',
        label: '本页面JSON',
        onClick: () => viewCode('page'),
      },
      {
        type: 'button',
        level: 'link',
        icon: 'fa fa-code-fork',
        label: 'APP路由配置',
        onClick: () => viewCode('route'),
      },
      {
        type: 'button',
        level: 'link',
        icon: 'fa fa-unlock',
        label: '当前拥有权限',
        onClick: () => viewCode('limit'),
      },
    ],
  }

  return (
    <>
      <Drawer
        closeOnOutside
        theme={theme}
        size="lg"
        onHide={toggleDrawer}
        show={show}
        position="left"
      >
        <Spinner overlay show={show && loading} size="lg" />
        {show && (
          <Editor
            editorDidMount={onEditorMounted}
            options={{ readOnly: true }}
            editorTheme={theme === 'dark' ? 'vs-dark' : 'vs'}
            language="json"
            value={cachedSchema}
          />
        )}
      </Drawer>
      {render('body', dropDownSchema)}
    </>
  )
}

function transSchema(schema: any) {
  if (!isObject(schema)) {
    return
  }
  map(schema, (val, key) => {
    if (isFunction(val)) {
      ;(schema as any)[key] = 'Function Body'
    } else if (isObject(val)) {
      transSchema(val)
    }
  })
}
