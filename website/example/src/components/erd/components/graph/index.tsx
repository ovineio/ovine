import { observer } from 'mobx-react'
import React from 'react'

import Butterfly from '~/components/butterfly'

import { useStore } from '../../sotre'

import { initCanvas, options } from './canvas'
import mockData from './data'
import * as S from './styled'

const Graph = observer(() => {
  const { setCanvas, readOnly } = useStore()
  const onLoaded = (canvas) => {
    setCanvas(canvas)
    initCanvas()
  }

  return (
    <S.GraphWrap className={`${readOnly ? 'read-only' : ''}`}>
      <Butterfly {...mockData} options={options} onLoaded={onLoaded} />
    </S.GraphWrap>
  )
})

export default Graph
