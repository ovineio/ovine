import React from 'react'
// import { useImmer } from '@core/utils/hooks'

import Aside from '../aside'
import Canvas from '../canvas'
import Settings from '../settings'

import * as S from './styled'

const Layout = () => {
  const wrapRef = ($wrap: HTMLDivElement) => {
    if ($wrap) {
      const { top } = $wrap.getBoundingClientRect()
      $wrap.style.height = `${window.innerHeight - top}px`
    }
  }

  return (
    <S.LayoutWrap ref={wrapRef}>
      <Aside />
      <Canvas />
      <Settings />
    </S.LayoutWrap>
  )
}

export default Layout
