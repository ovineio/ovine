/**
 * 预览时的节点导航
 *
 * TODO: 优化树UI
 */

import React from 'react'
import { observer } from 'mobx-react'
import { Tree } from 'amis'

import { app } from '@core/app'

import { previewStore } from '@/components/preview/store'

import { useAsideStore } from '../store'

import { StyledTree } from './styled'

export default observer(() => {
  const { nodes } = useAsideStore()

  const onChange = (nodeId) => {
    if (nodeId && nodeId !== 'none') {
      previewStore.setSelectedId(nodeId)
    }
  }

  return (
    <StyledTree>
      <Tree
        theme={app.theme.getName()}
        hideRoot
        options={nodes}
        onChange={onChange}
        valueField="id"
        labelField="type"
      />
    </StyledTree>
  )
})
