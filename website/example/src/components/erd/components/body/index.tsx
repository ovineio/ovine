import React from 'react'

import Graph from '../graph'

import Header from './header'
import * as S from './styled'

const Canvas = () => {
  return (
    <S.BodyWrap>
      <Header />
      <Graph />
    </S.BodyWrap>
  )
}

export default Canvas
