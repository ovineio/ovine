// e.exports = require("axios")

// import { Editor } from 'amis-editor'
import cls from 'classnames'
import { observer, inject } from 'mobx-react'
import React, { useEffect, useRef } from 'react'

import { app } from '@core/app'

import { Editor } from '../../assets/scripts/editor.view'

import { StyledEditor } from './styled'

export default inject('store')(
  observer((props) => {
    const { isPreview, setEditorInstance, setLastSavedSchema } = props.store
    const { editorStore } = props
    const $editor = useRef(null)

    useEffect(() => {
      setEditorInstance($editor.current) // 主要用历史记录更新
      // TODO 异步获取时兼容
      setLastSavedSchema(editorStore.schema) // 第一次存储初始化数据
      return () => {
        setEditorInstance()
      }
    }, [])

    return (
      <StyledEditor className={cls({ 'd-none': isPreview })}>
        <Editor
          ref={$editor}
          className="is-fixed"
          theme={app.theme.getName()}
          preview={false}
          value={editorStore.schema}
          onChange={(value: any) => editorStore.updateSchema(value)}
          // $schemaUrl={schemaUrl}
        />
      </StyledEditor>
    )
  })
)
