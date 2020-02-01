/**
 * 自定义 rt-css 组件
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'

type CssType = (ns: string) => FlattenSimpleInterpolation

export type RtCssProps = RendererProps & {
  css?: CssType
}
const RtCrud = (props: RtCssProps) => {
  const { css: getCss, render, className = '', classPrefix, body } = props

  return (
    <StyledCss className={className} ns={classPrefix} css={getCss}>
      {render('body', body, {})}
    </StyledCss>
  )
}

Renderer({
  test: /(^|\/)rt\-css$/,
  name: 'rt-css',
})(RtCrud)

const StyledCss = styled.div<{ css?: CssType; ns: string }>`
  ${(p) => css`
    ${p.css && p.css(p.ns)};
  `};
`
