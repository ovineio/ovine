/**
 * rt-css 样式渲染器
 * 可为组件 传入自定义 css
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React from 'react'
import styled, { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

type CssType = (theme: DefaultTheme) => FlattenSimpleInterpolation

export type RtCssProps = RendererProps & {
  css?: CssType // 需要渲染的 css
  tag?: keyof JSX.IntrinsicElements | React.ComponentType<any> // 当前组件的 tagName
}
const RtCss = (props: RtCssProps) => {
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
})(RtCss)

const StyledCss = styled.div<{ css?: CssType }>`
  ${(p) => css`
    ${p.css && p.css(p.theme)};
  `};
`
