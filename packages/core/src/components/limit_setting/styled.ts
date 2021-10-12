import styled, { css } from 'styled-components'

export const StyledLimit = styled.div`
  ${({ theme: { ns } }) => css`
    .${ns}Tree {
      &-itemLabel {
        padding-left: 0 !important;
        &:hover {
          background: transparent;
          &:after {
            background: transparent;
          }
        }
      }
      &-item--isLeaf {
        display: inline-block;
        & > .${ns}Tree-itemLabel {
          margin-right: 10px;
        }
      }
      &-list {
        & > .${ns}Tree-item--isLeaf {
          display: block;
        }
      }
      &-sublist {
        margin-left: 20px;
      }
      &-item-icons {
        display: none;
      }
    }

    .${ns}Tabs {
      &-content {
        padding: 0;
      }
    }

    &.limit-drawer-normal {
      .${ns}Tabs-pane {
        position: absolute;
        width: calc(100% - 16px);
        height: calc(100% - 190px);
        overflow-y: auto;
      }
    }

    &.limit-drawer-service {
      .${ns}Tabs-pane {
        position: absolute;
        height: calc(100% - 100px);
        overflow-y: auto;
      }
    }
  `}

  .action-btns {
    margin-bottom: 5px;
  }
`
