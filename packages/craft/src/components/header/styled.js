import styled from 'styled-components'

export const StyledHeader = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  width: 100%;
  height: 60px;
  background: #666;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: #fff;
    li {
      margin-left: 40px;
      list-style: none;
      cursor: pointer;
    }
  }
`
