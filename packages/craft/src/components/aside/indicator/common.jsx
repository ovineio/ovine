import React from 'react'
import _ from 'lodash'

import * as S from './styled'

export const Container = (props) => {
  return (
    <S.StyledContainer>
      <div className="container-content">{props.children}</div>
    </S.StyledContainer>
  )
}

export const Horizontal = (props) => {
  const { hasItem, showSelector, className } = props
  return (
    <S.StyledHorizontal className={className}>
      <ul>
        {!hasItem ? (
          <li
            className="fa fa-plus-square-o  m-r-xs"
            data-tooltip="添加"
            data-position="top"
            data-type="add"
            onClick={showSelector}
          />
        ) : (
          <>
            <li
              className="fa fa-toggle-left  m-r-xs"
              data-tooltip="最左方添加"
              data-position="top"
              data-type="left"
              onClick={showSelector}
            />
            <li
              className="fa fa-toggle-right"
              data-tooltip="最右方添加"
              data-position="top"
              data-type="right"
              onClick={showSelector}
            />
          </>
        )}
      </ul>
    </S.StyledHorizontal>
  )
}

export const Vertical = (props) => {
  const { hasItem, showSelector, className } = props
  return (
    <S.StyledVertical className={className}>
      <ul>
        {!hasItem ? (
          <li
            className="fa fa-plus-square-o  m-r-xs"
            data-tooltip="添加"
            data-position="top"
            data-type="add"
            onClick={showSelector}
          />
        ) : (
          <>
            <li
              className="fa fa-toggle-up m-t-xs"
              data-tooltip="最上方添加"
              data-position="right"
              data-type="top"
              onClick={showSelector}
            />
            <li
              className="fa fa-toggle-down"
              data-tooltip="最下方添加"
              data-position="right"
              data-type="bottom"
              onClick={showSelector}
            />
          </>
        )}
      </ul>
    </S.StyledVertical>
  )
}

export const Corner = (props) => {
  return <S.StyledCorner {..._.pick(props, ['t', 'r', 'b', 'l'])}>{props.children}</S.StyledCorner>
}
