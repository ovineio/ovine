import styled from 'styled-components'

import { erdStyled } from '../../constants'

export const BodyWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const HeaderWrap = styled.div`
  position: relative;
  z-index: 4;
  flex: 0 0 ${erdStyled.hdHeight}px;
  height: ${erdStyled.hdHeight}px;
  padding: 0 20px;
  border-bottom: ${erdStyled.divideBorder};
  background-color: ${erdStyled.hdBgColor};
  font-size: 16px;

  .anticon-border-inner {
    font-size: 20px;
  }
`

export const ToolWrap = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 175px;
  background: #fff;
  box-shadow: rgb(0 0 0 / 10%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px;

  li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    &:hover {
      background-color: #eaeaea;
    }
  }
`
