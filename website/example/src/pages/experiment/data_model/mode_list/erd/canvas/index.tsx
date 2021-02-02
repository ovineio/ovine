import React from 'react'

import Header from './header'

import * as S from './styled'

const Canvas = () => {
  return (
    <S.CanvasWrap>
      <Header />
      <S.BodyWrap>body</S.BodyWrap>
    </S.CanvasWrap>
  )
}

export default Canvas
