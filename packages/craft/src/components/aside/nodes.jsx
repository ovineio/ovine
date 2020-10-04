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

import { useAsideStore } from './store'

import { StyledNodes } from './styled'

export default observer(() => {
  const { nodes } = useAsideStore()

  const onChange = (nodeId) => {
    previewStore.setSelectedId(nodeId)
  }

  return (
    <StyledNodes>
      <Tree
        theme={app.theme.getName()}
        hideRoot
        options={nodes}
        onChange={onChange}
        valueField="id"
        labelField="type"
      />
    </StyledNodes>
  )
})
