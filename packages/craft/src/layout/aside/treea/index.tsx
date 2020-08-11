import React from 'react'

import { useImmer } from '@core/utils/hooks'

import { useEditor } from '@/editor/context'

import Nodes from './nodes'
import { getConfigNode, createTreeData } from './parse'
import { StyledMain } from './styled'
import Toolbar from './toolbar'

export default () => {
  const { schema } = useEditor((state: any) => ({
    schema: state.schema,
  }))

  const [state, setState] = useImmer<any>({
    searchString: '',
    treeExpand: true,
    searchFocusIndex: 0,
    searchFoundCount: null,
    viewWidth: 180,
    viewExpand: true,
    treeData: createTreeData(getConfigNode(schema)),
  })

  const context = {
    state,
    setState,
  }

  return (
    <StyledMain>
      <Toolbar context={context} />
      <Nodes context={context} />
    </StyledMain>
  )
}
