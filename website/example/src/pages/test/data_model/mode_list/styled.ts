import { css } from 'styled-components'

export const modelListPageCss = ({ ns }) => css`
  .${ns}Table-footTable {
    & > tbody > tr > th {
      display: none;
    }
  }
  .${ns}Table-foot {
    background: var(--Table-bg);
  }
  .field-extra {
    ul {
      padding: 0;
      display: flex;
    }
    li {
      list-style: none;
      margin-right: 20px;
      label {
        font-weight: bold;
        margin-right: 5px;
      }
    }
  }
`

export const modelDataListCss = () => css`
  .toolbar-divider {
    clear: both;
  }
`
