import styled from 'styled-components'

export const StyledDropdown = styled.div`
  position: relative;
  ul {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    min-width: 50px;
    padding: 4px 0px;
    color: inherit;
  }
  li {
    padding: 5px 12px;
    list-style: none;
    white-space: nowrap;
    line-height: 1;
    color: inherit;
    & > button {
      position: relative;
      padding: 0 0 0 24px;
      margin: 0;
      text-decoration: none !important;
      & > i {
        position: absolute;
        top: 3px;
        left: 0px;
        margin-left: 0 !important;
        font-size: 16px;
      }
    }
  }
`
