/**
 * 预览窗口
 */
import React, { useEffect } from 'react'
import { observer } from 'mobx-react'

import { Amis } from '@core/components/amis/schema'

import { domIds } from '@/constants'
import { useRootStore } from '@/stores'

import { usePreviewStore, PreviewProvider, previewStore } from './store'

import { StyledPreview } from './styled'
import Attacher from './attacher'

const Preview = observer(() => {
  const { renderSchema, schema, editId } = usePreviewStore()
  const { isStageMode } = useRootStore()

  return (
    <StyledPreview>
      {isStageMode && <Amis schema={schema} />}
      <div
        id={domIds.editorPreview}
        className={`preview-panel ${!isStageMode ? 'd-block' : 'd-none'}`}
      >
        <div data-preview="true">
          <Amis key={editId} schema={renderSchema} />
        </div>
        <Attacher />
      </div>
    </StyledPreview>
  )
})

export default () => {
  return (
    <PreviewProvider value={previewStore}>
      <Preview />
    </PreviewProvider>
  )
}
