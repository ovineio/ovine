/**
 * 自定义 rt-crud 组件
 */

import { Renderer } from 'amis'
import { css } from 'styled-components'

import { RtCssProps } from '../rt_css'

const RtCrud = (props: RtCssProps) => {
  const { css: getCss, render, className, tableClassName = '', filter, ...rest } = props

  const amisCurd: any = {
    className,
    type: 'rt-css',
    css: (ns: string) => css`
      ${crudCss(ns)};
      ${getCss && getCss(ns)};
    `,
    body: {
      ...rest,
      type: 'crud',
      className: 'rt-crud bg-white',
      tableClassName: `rt-crud-table ${tableClassName}`,
      affixHeader: false,
      filter: {
        ...filter,
        title: '',
        submitText: '',
        wrapWithPanel: false,
      },
    },
  }

  return render('body', amisCurd, {})
}

Renderer({
  test: /(^|\/)rt\-crud$/,
  name: 'rt-crud',
})(RtCrud)

const crudCss = (ns: string) => css`
  .rt-crud {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: calc(100% - 80px);
    margin: 15px;
    padding: 15px;
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
      .${ns}Table-headToolbar {
        flex: 0 0 auto;
      }
      .${ns}Table-footToolbar {
        flex: 0 0 auto;
      }
      .${ns}Table-contentWrap {
        flex: 1 0 auto;
      }
    }
  }

  .rt-crud-table {
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
      border-bottom: 1px solid #dee2e6;
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
    td {
      .${ns}Button {
        padding: 0;
        height: auto;
      }
      .${ns}Select {
        min-height: auto;
      }
    }
  }
`
