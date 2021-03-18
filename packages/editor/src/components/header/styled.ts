import styled from 'styled-components'

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 0 0 52px;
  position: relative;
  height: 52px;
  border-bottom: 0px solid transparent;
  background: rgb(255, 255, 255);
  box-shadow: rgba(100, 100, 100, 0.2) 0px 2px 3px 0px;
  z-index: 11;

  .toolbar-left {
    flex: 0;
    min-width: 360px;
    padding-right: 10px;
    display: flex;
    align-items: center;
    height: 100%;
  }

  .back-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 100%;
    margin-right: 7px;
    font-size: 16px;
    color: rgb(141, 158, 167);
    cursor: pointer;
    &:hover {
      background-color: rgb(232, 232, 232);
    }
  }

  .toolbar-right {
    flex: 0 0 360px;
  }

  .toolbar-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .toolbar-item {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    height: 100%;
    padding: 0 15px;
    transition: color 0.1s linear 0s;
    user-select: none;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: rgb(232, 232, 232);
    }

    &.active {
      background-color: rgb(232, 232, 232);
    }

    &.disabled {
      color: rgb(200, 205, 208);
      pointer-events: none;
      cursor: not-allowed;
    }

    &.view-mode {
      i {
        padding-top: 2px;
      }
    }

    .fa-mobile {
      font-size: 20px;
    }

    i {
      font-size: 14px;
      padding-right: 4px;
    }
    span {
      font-size: 14px;
    }
  }

  .breadcrumb {
    padding: 0;
    margin: 0;
    background: transparent;
  }

  .breadcrumb-item {
    max-width: 100px;
    max-width: 120px;
  }
`
