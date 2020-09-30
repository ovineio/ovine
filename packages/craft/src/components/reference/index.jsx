/**
 * 关联属性面板
 */
import React from 'react'
import { observer } from 'mobx-react'

import { Amis } from '@core/components/amis/schema'

import { ReferenceProvider, referenceStore, useReferenceStore } from './store'

import { StyledReference } from './styled'

const Reference = observer(() => {
  const { schema } = useReferenceStore()

  return (
    <StyledReference>
      <Amis schema={schema} />
    </StyledReference>
  )
})

export default () => {
  return (
    <ReferenceProvider value={referenceStore}>
      <Reference />
    </ReferenceProvider>
  )
}
