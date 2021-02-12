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

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
  }

  .erd-hd-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    padding-top: 1px;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 2px;
      list-style: none;
      cursor: pointer;

      &:hover {
        background-color: #eaeaea;
      }
      &:active {
        color: #4ea2e8;
        background-color: rgba(53, 144, 220, 0.2);
      }

      .active {
        padding: 4px;
        border-radius: 2px;
        color: #4ea2e8;
        font-weight: bold;
        background-color: rgba(53, 144, 220, 0.2);
      }

      .disabled {
        padding: 4px;
        border-radius: 2px;
        color: rgb(157 169 179);
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.1);
        cursor: not-allowed;
      }
    }

    .tool-btn {
      padding: 10px;
      width: auto;
      font-size: 14px;
      label {
        margin: 0 0 0 5px;
        cursor: pointer;
      }
    }
  }
`

export const AsideWrap = styled.div`
  flex: 0 0 230px;
  width: 230px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`
