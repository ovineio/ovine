import styled from 'styled-components'

export const StyledMain = styled.div`
  height: 100%;
`

export const StyledNodes = styled.div`
  height: calc(100% - 30px);
`

export const StyledToolBar = styled.div`
  position: relative;
  ul {
    display: flex;
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
  }
  .search-box {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: 0;
    background: #efefef;

    input {
      flex: 1;
      border: 0;
      min-width: 30px;
      outline: none;
      background: transparent;
    }
  }
  .search-icon {
    flex: 0 0 auto;
    padding-right: 8px;
  }
  .search-input {
  }
  .search-nav {
    flex: 0 0 auto;
    margin-right: 5px;
    li {
      width: 12px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #36c2f6;
      }
    }
  }
  .search-index {
    flex: 0 0 auto;
  }
  .tool-actions {
    position: absolute;
    z-index: 2;
    right: -8px;
    top: 30px;
    display: flex;
    flex-direction: column;
    li {
      cursor: pointer;
    }
    i {
      cursor: pointer;
    }
  }
`
