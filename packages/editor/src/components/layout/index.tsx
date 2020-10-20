import { observer } from 'mobx-react'
import React from 'react'

import { Amis } from '@core/components/amis/schema'

import { editorStore } from '@/stores/editor'
import { useRootStore } from '@/stores/root'

import Editor from '../editor'
import Header from '../header'

import { StyledBody, StyledLayout } from './styled'

export default observer(() => {
  const { isPreview } = useRootStore()

  return (
    <StyledLayout>
      <Header />
      <StyledBody>
        {isPreview && <Amis schema={editorStore.schema as any} />}
        <Editor editorStore={editorStore} />
      </StyledBody>
    </StyledLayout>
  )
})
