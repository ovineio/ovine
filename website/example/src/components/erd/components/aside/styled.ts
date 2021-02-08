import styled from 'styled-components'

import { erdStyled } from '../../constants'

export const AsideWrap = styled.div`
  flex: 0 0 230px;
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);

  .aside-body {
    flex: 1 1 auto;
    overflow-y: hidden;
  }
`

export const Header = styled.div`
  flex: 0 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${erdStyled.hdHeight}px;
  padding: 0 10px 0 10px;
  border-bottom: ${erdStyled.divideBorder};
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
  position: relative;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e5e7;
  background-color: rgb(248 249 251);

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
