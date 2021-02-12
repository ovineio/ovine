import styled from 'styled-components'

import { erdStyled } from '../../constants'

export const AsideWrap = styled.div`
  flex: 0 0 230px;
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 100%;
  &.sort-mode {
    .aside-header {
      border-bottom: 1px solid #3590dc;
    }
    .aside-body {
      border-right: 1px solid #3590dc;
      background: #f9fafc;
    }
  }
  .aside-body {
    display: flex;
    overflow-y: hidden;
    flex: 1 1 auto;
    flex-direction: column;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
  }

  .aside-nav {
    flex: 1 1 auto;
    overflow-y: hidden;
  }

  .sort-ctl {
    flex: 0 0 41px;
    height: 41px;
    line-height: 41px;
    box-sizing: border-box;
    padding-left: 30px;
    border-bottom: 1px solid rgb(195 204 226);
    background: #e8ecf5;
    color: #4b5668;
    user-select: none;
    span {
      padding-right: 10px;
    }

    button {
      border: 0;
      background: transparent;
      color: #128cee;
      text-decoration: underline;
      outline: none;
    }
  }
`

export const Header = styled.div`
  flex: 0 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${erdStyled.hdHeight}px;
  padding: 0 10px 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  background-color: ${erdStyled.hdBgColor};
  text-align: left;
  font-size: 16px;

  .title {
    .anticon {
      padding-right: 4px;
    }
  }
`

export const SearchBox = styled.div`
  flex: 0;
  position: relative;
  padding: 6px 8px;
  background-color: rgb(248 249 251);
  border-bottom: 1px solid #e5e5e7;

  &.disabled {
    input {
      background-color: #dfe0e1;
      cursor: not-allowed;
    }
  }
  input {
    width: 100%;
    border-radius: 0px;
    border: 1px solid rgb(229 229 231);
    height: 28px;
    text-indent: 24px;
    outline: 0px;
  }

  .anticon-search {
    position: absolute;
    top: 13px;
    left: 15px;
  }
  .anticon-close-circle {
    position: absolute;
    right: 15px;
    top: 13px;
    color: #aeaeb7;
  }
`
