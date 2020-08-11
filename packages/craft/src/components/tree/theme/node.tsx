/* eslint-disable */

import React, { Children, cloneElement } from 'react'
import styled from 'styled-components'

const Node = styled.div`
  min-width: 100%;
  position: relative;
`

export default (props: any) => {
  const {
    children,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    treeIndex,
    treeId, // Delete from otherProps
    getPrevRow, // Delete from otherProps
    node, // Delete from otherProps
    path, // Delete from otherProps
    rowDirection,
    canDrop = false,
    draggedNode = null,
    listIndex,
    swapFrom = null,
    swapLength = null,
    swapDepth = null,
    ...otherProps
  } = props

  return (
    <Node
      {...otherProps}
      ref={(instance: any) => {
        connectDropTarget(instance)
      }}
    >
      {Children.map(children, (child) =>
        cloneElement(child, {
          isOver,
          canDrop,
          draggedNode,
          lowerSiblingCounts,
          listIndex,
          swapFrom,
          swapLength,
          swapDepth,
        })
      )}
    </Node>
  )
}
