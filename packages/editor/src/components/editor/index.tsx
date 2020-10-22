// e.exports = require("axios")

import { Editor } from 'amis-editor'
import cls from 'classnames'
import { observer, inject } from 'mobx-react'
import React from 'react'

import { app } from '@core/app'

import { StyledEditor } from './styled'

export default inject('store')(
  observer((props) => {
    const { isPreview } = props.store
    const { editorStore } = props

    return (
      <StyledEditor className={cls({ 'd-none': isPreview })}>
        <Editor
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
