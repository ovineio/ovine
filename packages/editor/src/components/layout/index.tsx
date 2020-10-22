import { observer, inject } from 'mobx-react'
import React from 'react'

import { Amis } from '@core/components/amis/schema'

import { editorStore } from '@/stores/editor'

import Editor from '../editor'
import Header from '../header'

import { StyledBody, StyledLayout } from './styled'

export default inject('store')(
  observer((props) => {
    const { isPreview } = props.store

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
)
