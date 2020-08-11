/**
 * 视图区
 */

import React from 'react'

import { Amis } from '@core/components/amis/schema'

import { useEditor } from '@/editor/context'

import { StyledPreview } from './styled'

export default () => {
  const { schema } = useEditor((state: any) => ({
    schema: state.schema,
  }))

  return (
    <StyledPreview>
      <Amis schema={schema} />
    </StyledPreview>
  )
}
