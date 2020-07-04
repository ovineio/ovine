/**
 * 视图区
 */

import React from 'react'

import { Amis } from '@core/components/amis/schema'

import { useInternalEditor } from '@/editor/context'

import { StyledPreview } from './styled'

export default () => {
  const { store } = useInternalEditor()
  const { schema } = store.getState()

  return (
    <StyledPreview>
      <Amis schema={schema} />
    </StyledPreview>
  )
}
