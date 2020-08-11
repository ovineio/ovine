import React from 'react'
import { toggleExpandedForAll } from 'react-sortable-tree'

import { StyledToolBar } from './styled'

export default (props: any) => {
  const { context } = props

  const { treeExpand, treeData, searchString, searchFoundCount, searchFocusIndex } = context.state

  const onToggleTreeExpand = () => {
    context.setState((d: any) => {
      d.treeExpand = !d.treeExpand
      d.treeData = toggleExpandedForAll({
        treeData,
        expanded: d.treeExpand,
      })
    })
  }

  const onSearchTree = (e: any) => {
    e.persist()
    context.setState((d: any) => {
      d.searchString = e.target?.value || ''
    })
  }

  const onPrevMatchClick = () => {
    context.setState((d: any) => {
      d.searchFocusIndex =
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1
    })
  }

  const onNextMatchClick = () => {
    context.setState((d: any) => {
      d.searchFocusIndex = searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0
    })
  }

  return (
    <StyledToolBar>
      <div className="search-box">
        <i className="fa fa-search search-icon" />
        <input placeholder="搜索..." onChange={onSearchTree} />
        {searchString && (
          <>
            <ul className="search-nav">
              <li onClick={onPrevMatchClick}>
                <i className="fa fa-angle-left" />
              </li>
              <li onClick={onNextMatchClick}>
                <i className="fa fa-angle-right" />
              </li>
            </ul>
            <ul className="search-index">
              <li>{searchFoundCount > 0 ? searchFocusIndex + 1 : 0}</li>
              <li>/</li>
              <li>{searchFoundCount}</li>
            </ul>
          </>
        )}
      </div>
      <ul className="tool-actions">
        <li
          data-tooltip={treeExpand ? '折叠' : '展开'}
          data-position="right"
          onClick={onToggleTreeExpand}
        >
          <i className={`fa fa-${treeExpand ? 'folder-open' : 'folder'}`} />
        </li>
      </ul>
    </StyledToolBar>
  )
}
