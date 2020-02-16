/**
 * rt-css 样式渲染器
 * 可为组件 传入自定义 css
 */

import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React, { useEffect } from 'react'
import styled, { css, DefaultTheme, FlattenSimpleInterpolation } from 'styled-components'

type CssType = (theme: DefaultTheme) => FlattenSimpleInterpolation

export type RtCssProps = RendererProps & {
  css?: string | CssType // 需要渲染的 css
  htmlClassName?: string
  tag?: keyof JSX.IntrinsicElements | React.ComponentType<any> // 当前组件的 tagName
}

const RtCss = (props: RtCssProps) => {
  const { css: getCss, htmlClassName = '', tag, render, className = '', body } = props

  useEffect(() => {
    if (!htmlClassName) {
      return
    }
    changeHtmlClsName('add', htmlClassName)
    return () => changeHtmlClsName('remove', htmlClassName)
  }, [])

  return (
    <StyledCss as={tag} className={className} css={getCss}>
      {render('body', body)}
    </StyledCss>
  )
}

Renderer({
  test: /(^|\/)rt\-css$/,
  name: 'rt-css',
})(RtCss)

const changeHtmlClsName = (type: 'add' | 'remove', className: string) => {
  const $html = document.getElementsByTagName('html')[0]
  const clsAr = className.split(' ')
  const htmlClsAr = $html.className.split(' ')

  if (!htmlClsAr.length) {
    $html.className = type === 'add' ? className : ''
  }

  const result: string[] = []

  if (type === 'add') {
    clsAr.forEach((cls) => {
      if (!htmlClsAr.includes(cls)) {
        result.push(cls)
      }
    })
  }
  if (type === 'remove') {
    htmlClsAr.forEach((cls) => {
      if (!htmlClsAr.includes(cls)) {
        result.push(cls)
      }
    })
  }
  $html.className = result.join(' ')
}

const StyledCss = styled.div<{ css?: CssType }>`
  ${(p) => css`
    ${!p.css ? undefined : typeof p.css === 'string' ? p.css : p.css(p.theme)};
  `};
`
