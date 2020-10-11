/**
 * 预览窗口
 */
import { uuid } from 'amis/lib/utils/helper'
import { observer } from 'mobx-react'
import React, { useState } from 'react'

import { Amis } from '@core/components/amis/schema'
import { useSubscriber } from '@core/utils/hooks'

import { domId, message } from '@/constants'
import { useRootStore } from '@/stores'

import Attacher from './attacher'
import { usePreviewStore, PreviewProvider, previewStore } from './store'

import { StyledPreview } from './styled'

const Preview = observer(() => {
  const { renderSchema, schema, editId } = usePreviewStore()
  const { isStageMode } = useRootStore()

  const [refreshKey, setRefreshKey] = useState('')

  useSubscriber(message.onNodeAction, () => {
    setRefreshKey(uuid())
  })

  return (
    <StyledPreview>
      {isStageMode && <Amis schema={schema} />}
      <div
        id={domId.editorPreview}
        className={`preview-panel ${!isStageMode ? 'd-block' : 'd-none'}`}
      >
        <div data-preview="true">
          <Amis key={`${editId}_${refreshKey}`} schema={renderSchema} />
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
