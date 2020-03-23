import { css, DefaultTheme } from 'styled-components'

import { breakpoints } from '@/constants'

type CssProps = DefaultTheme & {
  tableWidth: number
}

export const crudCss = ({ tableWidth, ns, colors }: CssProps) => css`
  height: 100%;
  padding: 15px 0 0;
  .rt-crud {
    margin: 0 15px 15px;
    padding: 15px;
    background-color: ${colors.layoutHeaderBg};
  }
  .rt-crud-table {
    td {
      vertical-align: middle;
      .${ns}Button {
        &--link {
          height: auto;
          text-decoration: none;
          span {
            color: ${colors.linkHover};
          }
        }
      }
      .${ns}Select {
        min-height: auto;
      }
    }
    .${ns}OperationField {
      .${ns}Button {
        &--link {
          padding: 0;
        }
        &-icon {
          padding: 5px;
        }
      }
    }
  }
  @media (min-width: ${breakpoints.md}px) {
    .rt-crud {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      height: calc(100% - 15px);
      & > .${ns}Form {
        flex: 0 0 auto;
        margin-bottom: 10px;
      }
      & > .${ns}Table {
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        margin-bottom: 0;
        .${ns}Table {
          &-content {
            height: 100%;
          }
          &-headToolbar {
            flex: 0 0 auto;
          }
          &-footToolbar {
            flex: 0 0 auto;
          }
          &-contentWrap {
            flex: 1 0 auto;
          }
        }
      }
    }

    .rt-crud-table {
      height: 100%;
      min-width: ${tableWidth}px;
      thead,
      tbody {
        tr {
          table-layout: fixed;
          display: table;
          width: 100%;
          box-sizing: content-box;
        }
      }
      thead {
        border-bottom: 1px solid ${colors.border};
        tr {
          background-color: transparent;
        }
      }
      tbody {
        display: block;
        overflow-y: scroll;
        height: 100%;
      }
      tr {
        &:first-child {
          border-top: 0;
        }
      }
    }
  }
  @media (max-width: ${breakpoints.md - 1}px) {
    .${ns}Table-content {
      min-height: 300px;
    }
  }
`
