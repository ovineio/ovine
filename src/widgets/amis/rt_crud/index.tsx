/**
 * 自定义 crud 组件
 */

import { Renderer } from 'amis'
import { css } from 'styled-components'

import { RtCssProps } from '../rt_css'

import { crudCss } from './styled'

export const getAmisCrudSchema = (props: any) => {
  const { tableClassName = '', filter, ...rest } = props

  const crudSchema: any = {
    ...rest,
    type: 'crud',
    className: 'rt-crud bg-white r',
    tableClassName: `rt-crud-table ${tableClassName}`,
    affixHeader: false,
    filter: {
      ...filter,
      title: '',
      submitText: '',
      wrapWithPanel: false,
    },
  }

  return crudSchema
}

const RtCrud = (props: RtCssProps) => {
  const { css: getCss, render, className, tableClassName = '', filter, ...rest } = props

  const amisCurd: any = {
    className,
    type: 'rt-css',
    css: (ns: string) => css`
      ${crudCss(ns)};
      ${getCss && getCss(ns)};
    `,
    body: getAmisCrudSchema(props),
  }

  return render('body', amisCurd)
}

Renderer({
  test: /(^|\/)rt\-crud$/,
  name: 'rt-crud',
})(RtCrud)
