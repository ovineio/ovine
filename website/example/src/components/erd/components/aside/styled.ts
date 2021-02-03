import styled from 'styled-components'

export const AsideWrap = styled.div`
  flex: 0 0 230px;
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`

export const Header = styled.div`
  flex: 0 0 36px;
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #f8f9fb;
  text-align: left;
  font-size: 16px;

  .title {
    .anticon {
      padding-right: 4px;
    }
  }
  .tool {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      cursor: pointer;
    }
  }
`

export const SearchBox = styled.div`
  position: relative;
  padding: 6px 8px;
  background-color: #f5f5fb;
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
    position: absolute;
    top: 13px;
    left: 15px;
  }
`
