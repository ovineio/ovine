import { css, DefaultTheme } from 'styled-components'

import { breakpoints } from '@/constants'

export const crudCss = ({ ns, colors }: DefaultTheme) => css`
  .lib-crud {
    &>.${ns}Form {
      padding-bottom: 6px;
    }
  }
  .lib-crud-table {
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
          .${ns}Button-icon {
            padding: 5px;
          }
        }
      }
    }
  }
  .${ns}Crud-body {
    margin-bottom: 0;
  }
  /* @media (min-width: ${breakpoints.md}px) {
    .lib-crud {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      height: calc(100% - 15px);
      .${ns}Table-checkCell {
        width: 20px;
      }
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

    .lib-crud-table {
      height: 100%;
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
  } */
`
