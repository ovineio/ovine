/* eslint-disable */

import React from 'react'

import { StyledContent } from './styled_content'

function isDescendant(older: any, younger: any) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some((child: any) => child === younger || isDescendant(child, younger))
  )
}

export default (props: any) => {
  const {
    treeId, // Not needed, but preserved for other renderers
    isOver, // Not needed, but preserved for other renderers
    scaffoldBlockPxWidth,
    connectDragPreview,
    connectDragSource,
    isDragging,
    node,
    path,
    treeIndex,
    didDrop,
    lowerSiblingCounts,
    listIndex,
    canDrop = false,
    canDrag = false,
    isSearchMatch = false,
    isSearchFocus = false,
    toggleChildrenVisibility = null,
    title = null,
    draggedNode = null,
    icons = [],
    buttons = [],
    className = '',
    style = {},
    swapFrom = null,
    swapLength = null,
    swapDepth = null,
    parentNode = null, // Needed for dndManager
    rowDirection,
    ...otherProps
  } = props

  const nodeTitle = title || node.title || ''

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
  const isLandingPadActive = !didDrop && isDragging

  // Construct the scaffold representing the structure of the tree
  const scaffold: any = []

  lowerSiblingCounts.forEach((_: any, i: number) => {
    scaffold.push(
      <div key={`pre_${1 + i}`} style={{ width: scaffoldBlockPxWidth }} className="line-block" />
    )

    if (treeIndex !== listIndex && i === swapDepth) {
      // This node has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = ''

      if (listIndex === swapFrom + swapLength - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the node will go when released)
        highlightLineClass = 'highlight-bottom-left-corner'
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = 'highlight-top-left-corner'
      } else {
        // This block is between the bottom and top
        highlightLineClass = 'highlight-line-vertical'
      }

      scaffold.push(
        <div
          key={`highlight-${1 + i}`}
          style={{
            width: scaffoldBlockPxWidth,
            left: scaffoldBlockPxWidth * i,
          }}
          className={`absolute-line-block line-block ${highlightLineClass}`}
        />
      )
    }
  })

  return (
    <StyledContent
      style={{ height: '100%' }}
      {...otherProps}
      ref={(instance: any) => {
        if (canDrag) {
          connectDragSource(instance, { dropEffect: 'copy' })
        }
      }}
    >
      {toggleChildrenVisibility && node.children && node.children.length > 0 && (
        <i
          className={`fa icon-toggle fa-angle-${node.expanded ? 'down' : 'right'}`}
          style={{
            left: (lowerSiblingCounts.length - 0.9) * scaffoldBlockPxWidth,
          }}
          onClick={() =>
            toggleChildrenVisibility({
              node,
              path,
              treeIndex,
            })
          }
        />
      )}

      <div className={`node-wrapper ${!canDrag ? 'node-wrapper-drag-disabled' : ''}`}>
        {connectDragPreview(
          <div style={{ display: 'flex' }}>
            {scaffold}
            <div
              className={`node ${isLandingPadActive ? 'node-landing-pad' : ''}${
                isLandingPadActive && !canDrop ? ' node-cancel-pad' : ''
              }${isSearchMatch ? ' node-search-match' : ''}${
                isSearchFocus ? ' node-search-focus' : ''
              }${className ? ` ${className}` : ''}`}
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
            >
              <div className={`node-contents${!canDrag ? ' node-contents-drag-disabled' : ''}`}>
                <div className="node-toolbar node-icon">
                  {icons.map((icon: string, index: number) => (
                    <div key={index} className="toolbar-button">
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="node-label">
                  <span className="node-title">
                    {typeof nodeTitle === 'string'
                      ? nodeTitle
                      : nodeTitle({
                          node,
                          path,
                          treeIndex,
                        })}
                  </span>
                </div>

                <div className="node-toolbar node-menu">
                  {buttons.map((btn: any, index: number) => (
                    <div key={index} className="toolbar-button">
                      {btn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StyledContent>
  )
}
