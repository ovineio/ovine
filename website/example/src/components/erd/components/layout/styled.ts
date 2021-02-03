import styled from 'styled-components'

export const LayoutWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #fff;

  &.full-screen {
    position: fixed;
    z-index: 1201;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
`

export const AsideWrap = styled.div`
  flex: 0 0 230px;
  width: 230px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`
