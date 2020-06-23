import styled from 'styled-components'

export const StyledAside = styled.div`
  flex: 0 0 auto;
  position: relative;
  width: 230px;
  height: 100%;
  padding-left: 40px;
  border-right: 1px solid rgb(219, 219, 219);
  background-color: #fff;
`

export const StyledTabs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  width: 40px;
  height: 100%;
  padding: 12px 0;
  border-right: 1px solid rgb(219, 219, 219);
  background: #fff;

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: rgb(65, 80, 88);

    i {
      width: 26px;
      height: 26px;
      line-height: 26px;
      font-size: 16px;
      &:hover {
        background-color: rgb(232, 232, 232);
      }
    }
  }
`
