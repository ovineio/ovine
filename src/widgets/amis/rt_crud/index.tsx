/**
 * 自定义 rt-crud 组件
 */

import { Renderer } from 'amis'
import { css } from 'styled-components'

import { RtCssProps } from '../rt_css'

const RtCrud = (props: RtCssProps) => {
  const { css: getCss, render, className, ...rest } = props

  const amisCurd = {
    className,
    type: 'rt-css',
    body: {
      ...rest,
      type: 'crud',
      className: 'amis-curd bg-white',
    },
    css: (ns: string) => css`
      .amis-curd {
        margin: 15px;
        padding: 15px;
        & > .${ns}Table {
          margin-bottom: 0;
        }
        & > .${ns}Form {
          margin-bottom: 10px;
        }
      }
      ${getCss && getCss(ns)};
    `,
  }

  return render('body', amisCurd, {})
}

Renderer({
  test: /(^|\/)rt\-crud$/,
  name: 'rt-crud',
})(RtCrud)
