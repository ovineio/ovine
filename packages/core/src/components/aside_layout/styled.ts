import styled, { css, DefaultTheme } from 'styled-components'

import { ellipsis } from '@/styled/utils'

// TODO: 优化 侧边栏 展开/关闭 动画效果
export const StyledLayout = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  ${({ theme: { ns } }: { theme: DefaultTheme }) => css`
    &.with-route-tabs {
      .${ns}Layout {
        &--headerFixed {
          padding-top: 0;
        }
        &-headerBar {
          .${ns}Page {
            width: 100%;
            padding: 0 10px;
            &-body {
              padding: 0;
            }
          }
        }
        &-body {
          padding-top: 100px;
        }
      }
    }
    .${ns}Layout {
      height: 100%;

      &-headerBar {
        padding: 0;
        .${ns}Page {
          background: transparent;
          width: 100%;
          padding: 0 10px;
          &-main {
            background-color: transparent;
          }
          &-body {
            padding: 0;
          }
        }
      }
      &-brand {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-right: 10px;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .${ns}AsideNav-item {
      white-space: nowrap;
    }
  `}

  .app-layout-brand {
    color: #fff;
    &:hover,
    &:active {
      color: #fff;
    }
  }

  .app-layout-body {
    position: relative;
    height: 100%;
  }
`

export const SearchInput = styled.div`
  position: relative;
  top: 4px;
  ${({ theme: { ns } }) => css`
    .${ns}TreeSelect-arrow {
      display: none;
    }
    .${ns}TreeSelect {
      width: 0;
      display: none;
      box-shadow: none;
      border-width: 0 0 1px 0;
      border-radius: 0;
      &.is-opened {
        box-shadow: none;
      }
    }
    .${ns}ResultBox.is-clickable:not(.is-disabled):hover {
      box-shadow: none;
    }
    .${ns}TreeSelect-value {
      ${ellipsis()};
    }
    .${ns}TreeSelect-popover .${ns}Tree {
      min-width: 350px;
      margin-top: 6px;
      border-radius: 2px;
    }
    .${ns}ResultBox-singleValue {
      white-space: nowrap;

      & + input {
        display: none;
      }
    }
    .active {
      .${ns}TreeSelect {
        display: flex;
        min-width: 180px;
        background-color: transparent;
      }
    }
  `}
`
