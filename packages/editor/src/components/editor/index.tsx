import { Spinner } from 'amis'
import { Editor } from 'amis-editor'
import cls from 'classnames'
import { observer } from 'mobx-react'
import React, { useState } from 'react'

import { app } from '@core/app'

import { useRootStore } from '@/stores/root'

import { StyledEditor } from './styled'

export default observer((props: any) => {
  const { isPreview } = useRootStore()
  const [isLoading, setLoading] = useState(true)
  const { editorStore } = props

  const onEditorMount = () => {
    setLoading(false)
  }

  return (
    <StyledEditor className={cls({ 'd-none': isPreview })}>
      <Spinner overlay show={isLoading} theme={app.theme.getName()} size="lg" key="editorLoading" />
      <Editor
        className="is-fixed"
        theme={app.theme.getName()}
        preview={false}
        value={editorStore.schema}
        onEditorMount={onEditorMount}
        onChange={(value: any) => editorStore.updateSchema(value)}
        // $schemaUrl={schemaUrl}
      />
    </StyledEditor>
  )
})
