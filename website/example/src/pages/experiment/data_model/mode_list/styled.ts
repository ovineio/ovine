import { css } from 'styled-components'

import { storage } from '@core/constants'
import { getGlobal } from '@core/utils/store'

const getFixTop = () => (getGlobal(storage.supportRouteTabs) ? 100 : 50)

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
  .model-list-nav {
    width: 200px;

    .scrollbar-wrap {
      position: sticky;
      top: ${getFixTop()}px;
      height: ${`calc(100vh - ${getFixTop()}px)`};
    }
    .${ns}Nav {
      padding-bottom: 20px;
    }
    .${ns}Nav-item {
      a {
        padding-left: 20px;
        border-left: 0;
        border-right: 0;
      }
    }
  }
`

export const modelDataListCss = ({ ns }) => css`
  padding: 20px;
  border-left: 1px solid #eceff8;
  .${ns}Crud-body {
    border: 0;
  }
  .toolbar-divider {
    clear: both;
  }
`
