import React from 'react'

import * as S from './styled'

export const Container = (props) => {
  return (
    <S.StyledContainer>
      <h6 className="container-title">{props.title || '容器模版'}</h6>
      <div className="container-content">{props.children}</div>
    </S.StyledContainer>
  )
}

export const Horizontal = (props) => {
  return (
    <S.StyledHorizontal className={props.className}>
      <ul>
        <li
          className="fa fa-toggle-left  m-r-xs"
          data-tooltip="在最左边添加组件"
          data-position="top"
        ></li>
        <li className="fa fa-toggle-right" data-tooltip="在最右边添加组件" data-position="top"></li>
      </ul>
    </S.StyledHorizontal>
  )
}

export const Vertical = (props) => {
  return (
    <S.StyledVertical className={props.className}>
      <ul>
        <li
          className="fa fa-toggle-up m-t-xs"
          data-tooltip="在最上边添加组件"
          data-position="right"
        ></li>
        <li
          className="fa fa-toggle-down"
          data-tooltip="在最下边添加组件"
          data-position="right"
        ></li>
      </ul>
    </S.StyledVertical>
  )
}

export const Corner = (props) => {
  return <S.StyledCorner pos={props.pos}>{props.children}</S.StyledCorner>
}
