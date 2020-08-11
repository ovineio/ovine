import React from 'react'
import SortableTree from 'react-sortable-tree'

import TreeTheme from '@/components/tree/theme'

import { StyledNodes } from './styled'

// const icons = {
//   basic: '',
//   function: '',
//   object: '',
//   array: '',
//   param: '',
// }

export default (props: any) => {
  const { context } = props
  const { treeData, searchString, searchFocusIndex } = context.state

  const updateTreeData = (data: any) => {
    context.setState((d: any) => {
      d.treeData = data
    })
  }

  const onSearchFinish = (matches: any) => {
    context.setState((d: any) => {
      d.searchFoundCount = matches.length
      d.searchFocusIndex = matches.length > 0 ? searchFocusIndex % matches.length : 0
    })
  }

  return (
    <StyledNodes>
      <SortableTree
        theme={TreeTheme}
        treeData={treeData}
        onChange={updateTreeData}
        searchQuery={searchString}
        searchFocusOffset={searchFocusIndex}
        searchFinishCallback={onSearchFinish}
        canDrag={({ node }: any) => !node.dragDisabled}
        canDrop={({ nextParent }: any) =>
          !nextParent || ['object', 'array'].includes(nextParent.type)
        }
        generateNodeProps={() => ({
          icons: [<i className="fa fa-clone" />],
        })}
      />
    </StyledNodes>
  )
}
