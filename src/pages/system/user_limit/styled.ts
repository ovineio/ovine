import styled, { css } from 'styled-components'

export const StyledLimit = styled.div<{ ns: string }>`
  ${({ ns }) => css`
    .${ns}Tree-itemLabel {
      &:hover {
        background: transparent;
      }
    }
    .${ns}Tree-item--isLeaf {
      display: inline-block;
      & > .${ns}Tree-itemLabel {
        margin-right: 15px;
      }
      &:nth-of-type(n + 2) {
        & > .${ns}Tree-itemLabel {
          padding-left: 0 !important;
        }
      }
    }
    .${ns}Tabs-content {
      height: 380px;
      overflow-y: auto;
    }
  `}

  .action-btns {
    margin-bottom: 5px;
  }
`
