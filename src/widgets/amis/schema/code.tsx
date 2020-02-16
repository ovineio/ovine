import { Drawer, Spinner } from 'amis'
import cloneDeep from 'lodash/cloneDeep'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import map from 'lodash/map'
import React, { lazy, useMemo, useRef, useState, Suspense } from 'react'
import { Portal } from 'react-overlays'

import { getRouteConfig } from '~/routes/config'
import { getStore } from '~/utils/store'
import HeadItem from '~/widgets/layout/head_item'
import { PopupItemMenu } from '~/widgets/layout/styled'

import { RtSchema } from './types'

type Props = {
  theme: string
  schema: RtSchema
}

const LazyEditor = lazy(() => import('amis/lib/components/Editor')) as any

type CodeType = 'route' | 'page' | 'limit'
export default (props: Props) => {
  const { theme, schema } = props

  const [show, toggle] = useState(false)
  const [code, setCode] = useState<CodeType>('page')
  const storeRef = useRef<Types.ObjectOf<any>>({})

  const toggleDrawer = () => toggle((s) => !s)

  const cachedSchema = useMemo(() => {
    let json: any = {}
    if (storeRef.current[code]) {
      return storeRef.current[code]
    }
    switch (code) {
      case 'page':
        json = cloneDeep(schema)
        transSchema(json)
        break
      case 'route':
        json = cloneDeep(getRouteConfig())
        transSchema(json)
        break
      case 'limit':
        json = {
          authLimits: getStore<string>('test_limit')?.split(','),
          authApis: getStore<string>('test_apis')?.split(','),
        }
        break
    }
    const jsonStr = JSON.stringify(json)
    storeRef.current[code] = jsonStr
    return jsonStr
  }, [schema, code])

  const viewCode = (codeType: CodeType) => {
    setCode(codeType)
    toggleDrawer()
  }

  return (
    <Portal container={() => document.getElementById('app-header-left')}>
      <Drawer
        closeOnOutside
        theme={theme}
        size="lg"
        onHide={toggleDrawer}
        show={show}
        position="left"
      >
        {show && (
          <Suspense fallback={<Spinner size="lg" show />}>
            <LazyEditor
              options={{ readOnly: true }}
              editorTheme={theme === 'dark' ? 'vs-dark' : 'vs'}
              language="json"
              value={cachedSchema}
            />
          </Suspense>
        )}
      </Drawer>
      <HeadItem
        faIcon="code"
        tip="查看代码"
        trigger="focus"
        triggerContent={
          <PopupItemMenu>
            <ul>
              <li onClick={() => viewCode('page')}>
                <i className="fa fa-file-code-o" />
                <span>本页面JSON</span>
              </li>
              <li onClick={() => viewCode('route')}>
                <i className="fa fa-code-fork" />
                <span>APP路由配置</span>
              </li>
              <li onClick={() => viewCode('limit')}>
                <i className="fa fa-unlock" />
                <span>当前拥有权限</span>
              </li>
            </ul>
          </PopupItemMenu>
        }
      />
    </Portal>
  )
}

const transSchema = (schema: any) => {
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
