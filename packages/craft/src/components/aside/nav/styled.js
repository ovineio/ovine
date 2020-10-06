import styled from 'styled-components'

export const StyledNav = styled.div`
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    width: 100%;
    margin: 5px 0;
    padding: 0 5px;
    border: 1px solid #dedede;
    list-style: none;
    cursor: pointer;

    &:hover {
      color: #108cee;
      border-color: #108cee;
    }

    &.active {
      color: #fff !important;
      background-color: #108cee;
      border-color: #108cee;
      cursor: default;
    }
  }
`
