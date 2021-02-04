import { observer } from 'mobx-react'
import React from 'react'
// import { useImmer } from '@core/utils/hooks'

import { useStore } from '../../store'

import Aside from '../aside'
import Body from '../body'
import Settings from '../settings'

import * as S from './styled'

const Layout = observer(() => {
  const { graph } = useStore()

  const wrapRef = ($wrap: HTMLDivElement) => {
    if ($wrap) {
      const { top } = $wrap.getBoundingClientRect()
      $wrap.style.height = `${window.innerHeight - top}px`
    }
  }

  return (
    <S.LayoutWrap ref={wrapRef} className={graph.fullScreen ? 'full-screen' : ''}>
      <Aside />
      <Body />
      <Settings />
    </S.LayoutWrap>
  )
})

export default Layout
