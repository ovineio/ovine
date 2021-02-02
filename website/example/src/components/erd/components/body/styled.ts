import styled from 'styled-components'

export const BodyWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const HeaderWrap = styled.div`
  position: relative;
  z-index: 4;
  flex: 0 0 36px;
  height: 36px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #f8f9fb;
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    padding: 0 20px;
    margin: 0;

    li {
      list-style: none;
      margin-right: 15px;
      cursor: pointer;
    }
  }
`

export const ToolWrap = styled.div`
  position: absolute;
  top: 60px;
  left: 20px;

  li {
    cursor: pointer;
  }
`
