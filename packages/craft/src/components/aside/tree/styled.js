import styled from 'styled-components'

export const StyledTree = styled.div`
  width: 100%;

  ul {
    padding-left: 10px;
  }
  li {
    list-style: none;
  }

  .tree-root {
    padding-left: 0;
  }
  .tree-leaf {
    padding-left: 6px;
  }

  .icon-arrow.is-fold:before {
    transform: rotate(45deg);
    transform-origin: 0% 50%;
  }

  .node-normal {
    span {
      &:hover {
        color: #108cee;
        cursor: pointer;
      }
    }
  }

  .node-hover {
    color: #108cee;
  }

  .node-selected {
    background: #128cee;
    span {
      color: #fff;
    }
    .icon-arrow:before {
      border-color: #fff;
    }
  }
`
