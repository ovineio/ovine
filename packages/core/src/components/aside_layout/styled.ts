import styled, { css, DefaultTheme } from 'styled-components'

import { ellipsis } from '@/styled/utils'

export const StyledLayout = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  ${({ theme: { ns, colors } }: { theme: DefaultTheme }) => css`
    .${ns}Layout {
      height: 100%;
      &-body {
        background-color: ${colors.bodyBg};
        color: ${colors.text};
      }
      &-headerBar {
        .${ns}Page {
          width: 100%;
          &-main {
            background-color: transparent;
          }
          &-body {
            padding: 0;
          }
        }
      }
    }
  `}

  .app-layout-brand {
    color: #fff;
    &:hover,
    &:active {
      color: #fff;
    }
  }
`

export const SearchInput = styled.div`
  position: relative;
  top: 2px;
  height: 34px;
  ${({ theme: { ns } }) => css`
    .${ns}TreeSelect-arrow {
      display: none;
    }
    .${ns}TreeSelect {
      width: 0;
      display: none;
      border-width: 0 0 1px 0;
      border-radius: 0;
    }
    .${ns}TreeSelect-value {
      ${ellipsis()};
    }
    .${ns}TreeSelect-popover .${ns}Tree {
      min-width: 350px;
      margin-top: 6px;
      border-radius: 2px;
    }
    .active {
      .${ns}TreeSelect {
        display: flex;
        width: 180px;
      }
    }
  `}
`
