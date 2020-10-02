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
  const { renderSchema, schema } = usePreviewStore()
  const { isStageMode } = useRootStore()

  return (
    <StyledPreview>
      <div className={isStageMode ? 'd-block' : 'd-none'}>
        <Amis schema={schema} />
      </div>
      <div className={!isStageMode ? 'd-block' : 'd-none'}>
        <div id={domIds.editorPreview}>
          <Amis schema={renderSchema} />
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
