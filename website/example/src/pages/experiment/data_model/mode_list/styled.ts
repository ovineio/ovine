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

  .${ns}Crud-selection {
    margin: 5px 0;
  }

  .${ns}Table-itemActions {
    border-radius: 2px 2px 0 0;
    padding-left: 12px;
    height: 40px;
    transform: translateY(-100%);
    background: var(--light);
  }

  .model-list-crud {
    & > .${ns}Table {
      border: 0;
      .${ns}Table-content {
        overflow-y: hidden;
      }
    }
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
      overflow: hidden;
    }

    .toolbar-divider {
      margin-left: 0;
      clear: both;
    }
    .${ns}Nav-item {
      &.is-active a {
        border-radius: 0;
      }
      a {
        border-radius: 0;
      }
    }
    // 重写提示
    .${ns}Image-overlay {
      a {
        &[data-position='bottom']:after {
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
        &[data-position='bottom']:hover:after {
          margin: 0 0 0 var(--Tooltip--attr-gap);
        }
      }
    }
    .${ns}Crud-body {
      border: 0;
    }
    .${ns}Table-itemActions {
      .fa {
        padding-top: 4px;
      }
    }
    .${ns}Table-table {
      td > span {
        display: inline-block;
        max-width: 150px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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

export const QueryItem = styled.div`
  display: inline-flex;
  flex-direction: row;

  & > div {
    background: var(--light);
    margin-right: 4px;
    padding: 2px 10px;
    border-radius: 15px;
    span {
      &:nth-child(2) {
        padding: 0 5px;
      }
    }
    i {
      font-size: 14px;
      cursor: pointer;
    }
  }
`
