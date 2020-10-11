/**
 * 关联属性面板
 */
import { observer } from 'mobx-react'
import React from 'react'

import { Amis } from '@core/components/amis/schema'

import { useRootStore } from '@/stores'

import { ReferenceProvider, referenceStore, useReferenceStore } from './store'
import { StyledReference } from './styled'

const Reference = observer(() => {
  const { isStageMode } = useRootStore()
  const { schema } = useReferenceStore()

  return (
    <StyledReference className={isStageMode ? 'd-none' : 'd-block'}>
      <Amis key={schema.tabsId} schema={schema} />
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
