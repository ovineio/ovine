import styled from 'styled-components'

export const StyledQuick = styled.div`
  position: absolute;
  z-index: 2;
  width: 32px;
  right: 250px;
  top: 70px;
  background: #fff;

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    width: 32px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: rgb(65, 80, 88);

    &:hover {
      background-color: rgb(232, 232, 232);
    }
  }
`
