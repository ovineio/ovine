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
  font-size: 16px;
  .header-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    padding: 0 20px;
    margin: 0;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      list-style: none;
      cursor: pointer;

      &:hover {
        background-color: #eaeaea;
      }
    }
  }
`

export const ToolWrap = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 175px;
  background: #fff;
  box-shadow: rgb(0 0 0 / 10%) 0px 4px 6px -1px, rgb(0 0 0 / 6%) 0px 2px 4px -1px;

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    list-style: none;
    cursor: pointer;
    &:hover {
      background-color: #eaeaea;
    }
  }
`
