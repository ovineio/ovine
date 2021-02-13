import styled, { css } from 'styled-components'

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
`

export const ModelDetail = styled.div`
  display: flex;
  ${({ theme: { ns } }) => css`
    .detail-nav {
      width: 200px;
      flex: 0 0 200px;
      position: sticky;
      top: ${getFixTop()}px;
      height: ${`calc(100vh - ${getFixTop()}px)`};
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
    .detail-nav-hd {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid red;
      button {
        min-width: 40px;
      }
    }

    .detail-crud {
      flex: 1;
      padding: 0 20px 20px;
    }

    .toolbar-divider {
      margin-left: 0;
      clear: both;
    }
    .${ns}Crud-body {
      border: 0;
    }
    .${ns}Table-itemActions {
      .fa {
        padding-top: 4px;
      }
    }
    .${ns}Crud-pageSwitch {
      display: flex;
      align-items: center;
    }
    .${ns}Table-fixedTop {
      &.in {
        .${ns}Table-headToolbar {
          padding: 0 20px;
        }
      }
    }
  `}
`
