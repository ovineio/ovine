/**
 * rt-css 样式渲染器
 * 可为组件 传入自定义 css
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'

type CssType = (ns: string) => FlattenSimpleInterpolation

export type RtCssProps = RendererProps & {
  css?: CssType // 需要渲染的 css
  tag?: keyof JSX.IntrinsicElements | React.ComponentType<any> // 当前组件的 tagName
}
const RtCrud = (props: RtCssProps) => {
  const { css: getCss, tag, render, className = '', classPrefix, body } = props

  return (
    <StyledCss as={tag} className={className} ns={classPrefix} css={getCss}>
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
