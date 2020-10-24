import React, { useEffect } from 'react'

import { getStore, setStore } from '@core/utils/store'
import { deserialize, serialize } from '@core/utils/tool'
import Editor from '@ovine/editor/lib/index'

import { storeKeys } from '~/app/constants'

const defaultSchema = {
  type: 'page',
  title: '体验在线编辑页面效果～',
  body: '目前只能体验，等完成所有功能后，将可用于生产环境。',
}

const editorOption = {
  breadcrumb: '在线编辑页面',
  getSchema: () => deserialize(getStore<string>(storeKeys.testEditorSchema)) || defaultSchema,
  onSave: (schema) => {
    setStore(storeKeys.testEditorSchema, serialize(schema))
  },
}

export default () => {
  useEffect(() => {
    const { title } = document
    document.title = '正在编辑...'

    return () => {
      document.title = title
    }
  }, [])
  return <Editor {...editorOption} />
}
