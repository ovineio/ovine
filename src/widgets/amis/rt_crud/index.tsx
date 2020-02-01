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
    margin: 15px;
    padding: 15px;
    & > .${ns}Table {
      margin-bottom: 0;
    }
    & > .${ns}Form {
      margin-bottom: 10px;
    }
  }

  .rt-crud-table {
    thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
    thead {
      border-bottom: 1px solid #dee2e6;
    }
    tbody {
      display: block;
      max-height: 160px;
      overflow-y: scroll;
    }
    tr {
      &:first-child {
        border-top: 0;
      }
    }
  }
`
