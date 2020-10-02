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
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    color: #fff;
    li {
      margin-left: 40px;
      list-style: none;
      cursor: pointer;
      &:hover {
        color: blue;
      }

      &.disabled {
        color: grey;
      }
    }
  }
`
