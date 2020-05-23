/**
 * lib-css 样式渲染器
 * 可为组件 传入自定义 css
 */

import { Renderer, RendererProps } from 'amis/lib/factory'
import React from 'react'
import styled, { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

type CssType = (theme: DefaultTheme) => FlattenSimpleInterpolation

export type LibCssProps = RendererProps & {
  css?: string | CssType // 需要渲染的 css
  htmlClassName?: string
  tag?: keyof JSX.IntrinsicElements | React.ComponentType<any> // 当前组件的 tagName
}

@Renderer({
  test: /(^|\/)lib-css$/,
  name: 'lib-css',
})
export class LibCss extends React.Component<LibCssProps> {
  componentDidMount() {
    const { htmlClassName } = this.props

    if (htmlClassName) {
      $('html').addClass(htmlClassName)
    }
  }

  componentWillUnmount() {
    const { htmlClassName } = this.props

    if (htmlClassName) {
      $('html').removeClass(htmlClassName)
    }
  }

  render() {
    const { css: getCss, tag, render, className = '', body } = this.props

    return (
      <StyledCss as={tag} className={className} css={getCss}>
        {render('body', body)}
      </StyledCss>
    )
  }
}

const StyledCss = styled.div<{ css?: CssType }>`
  ${(p) => css`
    ${!p.css ? undefined : typeof p.css === 'string' ? p.css : p.css(p.theme)};
  `};
`
