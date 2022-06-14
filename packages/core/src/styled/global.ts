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

  .hidden {
    display: none;
  }

  svg.icon.icon-clock {
    top: 0;
  }

  /** lib 主题相关的全局样式 */
  /** fix antd table header */
  .antd-Table-table {
    & > thead > tr {
      border-bottom: 0;
      & > th {
        border: 0px;
        padding: 12px var(--TableCell-paddingX);
        box-shadow: inset -1px -1px 0px var(--Table-thead-borderColor),
          inset 0px 1px 0px var(--Table-thead-borderColor);
        &:not(:last-child) {
          box-shadow: inset -1px -1px 0px var(--Table-thead-borderColor),
            inset 0px 1px 0px var(--Table-thead-borderColor);
          border-right: 0px;
        }
        &.antd-Table-checkCell,
        &.antd-Table-expandCell {
          box-shadow: inset 0px -1px 0px var(--Table-thead-borderColor),
            inset 0px 1px 0px var(--Table-thead-borderColor);
        }
      }
      & + tr {
        border-top: 0;
        & > th {
          box-shadow: inset -1px -1px 0px var(--Table-thead-borderColor),
            inset 0px 0px 0px var(--Table-thead-borderColor);
          &:not(:last-child) {
            box-shadow: inset -1px -1px 0px var(--Table-thead-borderColor),
              inset 0px 0px 0px var(--Table-thead-borderColor);
          }
        }
      }
    }
  }
  .antd-Select .antd-PopOver.antd-Select-popover .antd-Select-menu .antd-Select-option {
    padding: 6px;
  }

  /** amis 兼容  */
  ${({ theme: { ns } }) => css`
    .line-break-json {
      .${ns}JsonField {
        width: 100%;
        span {
          white-space: normal;
          word-break: all;
        }
      }
    }

    .${ns}Select {
      &-option > label {
        white-space: nowrap;
      }
      &-popover {
        width: auto !important;
        min-width: 8rem;
      }
    }

    .${ns}Button {
      &--blank {
        color: var(--text-color);
        height: auto;
        &:hover {
          background-color: var(--Button--light-bg);
        }
        &.${ns}Button--iconOnly>i.fa {
          font-size: var(--fontSizeBased);
        }
      }
    }

    .cxd-Button--blank {
      &:hover {
        background-color: #d9d9d9;
      }
      &.cxd-Button--iconOnly {
        line-height: 1.4rem;
        & > i.fa {
          font-size: 0.9rem;
          line-height: 0.9rem;
        }
      }
    }

    .cxd-Page-title {
      .cxd-Remark-icon {
        vertical-align: baseline;
      }
    }

    .${ns}CBGroupOrItem {
      &:before,
      &:after,
      &:last-child:before {
        border-color: var(--Button--info-onActive-bg);
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

    .${ns}ExcelControl-dropzone {
      & > p {
        margin: 1rem auto;
      }
    }

    /** 1.9.1 BUG  */
    .rdtPicker {
      .rdtHeader {
        border-bottom: 0px;
      }
      td > span {
        width: 24px;
        height: 24px;
      }
    }

    /** 1.0.14 Tree BUG */
    .${ns}Toast-wrap--topCenter, .${ns}Toast-wrap--bottomCenter {
      transform: translateX(-50%);
      margin-left: 0;
    }

    /** 调整默认菜单UI */
    .app-root {
      .${ns}ContextMenu {
        &-menu {
          border-radius: var(--DropDown-menu-borderRadius);
          box-shadow: var(--DropDown-menu-boxShadow);
        }
        &-list {
          min-width: 100px;
        }
        &-item {
          padding: var(--DropDown-menuItem-paddingY) var(--DropDown-menuItem-paddingX);
          box-sizing: border-box;
          height: var(--DropDown-menu-height);
          color: var(--DropDown-menuItem-color);
          text-decoration: var(--link-decoration);
          white-space: nowrap;
          vertical-align: middle;
          height: auto;
          line-height: inherit;
          user-select: none;
          line-height: 1;
          cursor: pointer;
          a {
            background: transparent !important;
            padding: 0;
          }
          &:hover,
          &.active {
            background: var(--DropDown-menuItem-onHover-bg);
            color: var(--DropDown-menuItem-onHover-color);
          }
        }
      }
    }
  `}

  /** site 全局样式 */
  ${({ theme }) => getSiteStyle(theme)}
`

export default GlobalStyle
