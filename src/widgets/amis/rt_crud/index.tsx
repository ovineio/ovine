/**
 * 自定义 crud 组件
 */

import { Renderer } from 'amis'
import get from 'lodash/get'
import { css, DefaultTheme } from 'styled-components'

import { breakpoints } from '~/constants'

import { RtCssProps } from '../rt_css'

import { crudCss } from './styled'

const getAmisCrudSchema = (props: any) => {
  const { tableClassName = '', filter, headerToolbar = [], ...rest } = props

  const isSmScreen = window.innerWidth < breakpoints.md

  // 在小屏幕中 自动加入分页
  if (
    isSmScreen &&
    !headerToolbar.find((i: any) => i === 'pagination' || get(i, 'type') === 'pagination')
  ) {
    headerToolbar.push({
      type: 'pagination',
      align: 'right',
    })
  }

  const crudSchema: any = {
    keepItemSelectionOnPageChange: true,
    ...rest,
    type: 'crud',
    className: 'rt-crud r',
    tableClassName: `rt-crud-table ${tableClassName}`,
    affixHeader: isSmScreen,
    headerToolbar,
    filter: {
      ...filter,
      title: '',
      submitText: '',
      wrapWithPanel: false,
    },
  }

  return crudSchema
}

export type RtCrudProps = RtCssProps & {
  tableWidth?: number
}
const RtCrud = (props: RtCrudProps) => {
  const { css: getCss, render, className, tableWidth = 800 } = props

  const amisCurd: any = {
    className,
    type: 'rt-css',
    css: (theme: DefaultTheme) => css`
      ${crudCss({ ...theme, tableWidth })};
      ${getCss && getCss(theme)};
    `,
    body: getAmisCrudSchema(props),
  }

  return render('body', amisCurd)
}

Renderer({
  test: /(^|\/)rt\-crud$/,
  name: 'rt-crud',
})(RtCrud)
