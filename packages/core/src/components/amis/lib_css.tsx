/**
 * lib-css 样式渲染器
 * 可为组件 传入自定义 css
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React, { useEffect } from 'react'
import styled, { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

type CssType = (theme: DefaultTheme) => FlattenSimpleInterpolation

export type LibCssProps = RendererProps & {
  css?: string | CssType // 需要渲染的 css
  htmlClassName?: string
  tag?: keyof JSX.IntrinsicElements | React.ComponentType<any> // 当前组件的 tagName
}

const LibCss = (props: LibCssProps) => {
  const { css: getCss, htmlClassName = '', tag, render, className = '', body } = props

  useEffect(() => {
    if (!htmlClassName) {
      return
    }

    $('html').addClass(htmlClassName)

    // eslint-disable-next-line
    return () => {
      $('html').removeClass(htmlClassName)
    }
  }, [])

  return (
    <StyledCss as={tag} className={className} css={getCss}>
      {render('body', body)}
    </StyledCss>
  )
}

Renderer({
  test: /(^|\/)lib-css$/,
  name: 'lib-css',
})(LibCss)

const StyledCss = styled.div<{ css?: CssType }>`
  ${(p) => css`
    ${!p.css ? undefined : typeof p.css === 'string' ? p.css : p.css(p.theme)};
  `};
`
