import isFunction from 'lodash/isFunction'
import { createGlobalStyle, css, DefaultTheme } from 'styled-components'

import { app } from '@/app'

const getSiteStyle = (props: DefaultTheme) => {
  try {
    const siteStyle = app.styled.globalStyle
    return !isFunction(siteStyle) ? siteStyle : siteStyle(props)
  } catch (_) {
    //
  }

  return undefined
}

// 全局样式
const GlobalStyle = createGlobalStyle`
  /** lib 全局样式 */
  .app-root {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .form-control-static {
    min-height: 34px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin-bottom: 0;
  }

  .clickable {
    user-select: none;
    cursor: pointer;
  }

  .l-h-1 {
    line-height: 1;
  }

  .sub-h-full {
    & > *:only-child {
      height: 100%;
    }
  }

  .is-inline {
    display: inline;
  }
  


  /** lib 主题相关的全局样式 */
  /** amis 兼容  */

  ${({ theme: { ns, colors } }) => css`
    body > div {
      color: ${colors.text};
    }

    .${ns}Chart {
      min-width: 100px !important;
      min-height: 100px !important;
    }

    .line-break-json {
      .${ns}JsonField {
        width: 100%;
        span {
          white-space: normal;
          word-break: all;
        }
      }
    }

    .${ns}DateRangePicker {
      align-items: center;
    }

    .${ns}Drawer {
      &.hide-close-button {
        .${ns}Drawer-close {
          display: none;
        }
      }
    }

    .${ns}Crud-pager {
      & > div {
        white-space: nowrap;
      }
    }

    /** 1.0.14 Tree BUG */
    .${ns}Tree-itemIcon {
      line-height: 30px;
      &.${ns}Tree-leafIcon {
        svg {
          display: block;
          margin-top: 6px;
        }
      }
      svg {
        display: none;
      }
    }

    /** 调整默认菜单UI */
    #app-root {
      .${ns}ContextMenu {
        &-list {
          width: auto;
        }

        &-menu {
          box-shadow: none;
          &::before {
            border-radius: 0px;
          }
          &.in {
            animation-name: contextMenuIn;
            animation-duration: 100ms;
          }
        }

        &-item {
          position: relative;
          height: 20px;
          line-height: 20px;

          & > a {
            border: 0px !important;
          }
          &:not(.is-disabled):hover > a {
            background: #888888;
          }
        }
        &-item:hover {
          .${ns}ContextMenu-subList {
            box-shadow: none;
            border-radius: 0px;
            &::before {
              border-radius: 0px;
            }
          }
        }
      }
    }
  `}

  /** site 全局样式 */
  ${({ theme }) => getSiteStyle(theme)}
`

export default GlobalStyle
