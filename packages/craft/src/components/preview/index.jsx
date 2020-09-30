/**
 * 预览窗口
 */
import React, { useEffect } from 'react'
import { observer } from 'mobx-react'

import { Amis } from '@core/components/amis/schema'

import { domIds } from '@/constants'

import { usePreviewStore, PreviewProvider, previewStore } from './store'

import { StyledPreview } from './styled'
import Attacher from './attacher'

const Preview = observer(() => {
  const { renderSchema, schema } = usePreviewStore()

  return (
    <StyledPreview>
      <div id={domIds.editorPreview}>
        <Amis schema={renderSchema} />
      </div>
      <Attacher />
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
