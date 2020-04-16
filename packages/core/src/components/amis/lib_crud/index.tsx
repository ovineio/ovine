/**
 * 自定义 crud 组件
 */

import { Renderer } from 'amis'
import { get } from 'lodash'
import { css, DefaultTheme } from 'styled-components'

import { breakpoints } from '@/constants'

import { LibCssProps } from '../lib_css'

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
    className: 'lib-crud r',
    tableClassName: `lib-crud-table ${tableClassName}`,
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

export type LibCrudProps = LibCssProps & {
  tableWidth?: number
}
const LibCrud = (props: LibCrudProps) => {
  const { css: getCss, render, className, htmlClassName, tableWidth = 800 } = props

  const amisCurd: any = {
    className,
    htmlClassName,
    type: 'lib-css',
    css: (theme: DefaultTheme) => css`
      ${crudCss({ ...theme, tableWidth })};
      ${!getCss ? null : typeof getCss === 'string' ? getCss : getCss(theme)};
    `,
    body: getAmisCrudSchema(props),
  }

  return render('body', amisCurd)
}

Renderer({
  test: /(^|\/)lib-crud$/,
  name: 'lib-crud',
})(LibCrud)
