/**
 * 自定义页面
 * ----
 * 主要是参考如何编写自定义页面，请自行删除。
 */

import { Button, Spinner, Drawer } from 'amis'
import { Editor } from 'amis/lib/components'
import React from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'
import { getStore, setStore } from '@core/utils/store'

import { storeKeys } from '~/app/constants'

import { StyledStart } from './styled'

const templateSchema = JSON.stringify(
  {
    type: 'page',
    title: '点击右下角按钮，编辑schema',
    body: {
      type: 'alert',
      body: '只有正确的JSON格式，才能被正常渲染～',
      level: 'success',
    },
  },
  undefined,
  2
)

type State = {
  drawerVisible: boolean
  schemaInput: string
  schema: any
  loading: boolean
}

const initState = () => {
  const storedInput = getStore<string>(storeKeys.schemaEditor) || templateSchema
  return {
    drawerVisible: false,
    loading: true,
    schemaInput: storedInput,
    schema: JSON.parse(storedInput),
  }
}

export default () => {
  const [state, setState] = useImmer<State>(initState)
  const { loading, schema, schemaInput, drawerVisible } = state
  const theme: string = app.theme.getName()

  const onEditorMounted = () => {
    if (loading) {
      setState((d) => {
        d.loading = false
      })
    }
  }

  const onEditorChange = (value: string) => {
    let jsonVal = ''
    try {
      jsonVal = JSON.parse(value)
    } catch (e) {
      //
    }

    setState((d) => {
      d.schemaInput = value
      if (jsonVal) {
        d.schema = jsonVal
        setStore(storeKeys.schemaEditor, value)
      }
    })
  }

  const toggleDrawer = () => {
    setState((d) => {
      d.drawerVisible = !d.drawerVisible
    })
  }

  return (
    <StyledStart>
      {schema && <Amis schema={schema} />}
      <Drawer
        closeOnOutside
        overlay={false}
        theme={theme}
        size="md"
        onHide={toggleDrawer}
        show={drawerVisible}
        position="right"
      >
        <Spinner overlay show={drawerVisible && loading} size="lg" />
        <a className="p-md" href="https://baidu.github.io/amis/zh-CN/components/page" target="_blank">
          <i className="fa fa-flag p-r-xs" />
          <span>点击查看Amis渲染器手册</span>
        </a>
        {drawerVisible && (
          <Editor
            editorDidMount={onEditorMounted}
            onChange={onEditorChange}
            editorTheme={theme === 'dark' ? 'vs-dark' : 'vs'}
            language="json"
            value={schemaInput}
          />
        )}
      </Drawer>
      <div className="action-edit">
        <Button
          iconOnly
          theme={theme}
          level="danger"
          placement="top"
          tooltip="编辑schema"
          onClick={toggleDrawer}
        >
          <i className="fa fa-edit" />
        </Button>
      </div>
    </StyledStart>
  )
}
