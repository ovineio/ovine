import styled, { css } from 'styled-components'

export const StyledLimit = styled.div`
  ${({ theme: { ns } }) => css`
    .${ns}Tree {
      &-itemLabel {
        margin-bottom: 10px;

        &:hover {
          background: transparent;
          &:after {
            background: transparent;
          }
        }
      }

      &-item {
        .is-checked {
          background-color: transparent;
        }
        &--isLeaf {
          display: inline-block;
          & > .${ns}Tree-itemLabel {
            margin-right: 10px;
          }
          .${ns}Tree-itemArrowPlaceholder {
            display: none;
          }
        }
      }
      &-list {
        & > .${ns}Tree-item--isLeaf {
          display: block;
        }
      }
      &-sublist {
        margin-left: 26px;
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
`
