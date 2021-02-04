import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import Butterfly from '~/components/butterfly'

import { useStore } from '../../store'

import { initCanvas, options } from './canvas'
import * as S from './styled'
import { getNodesData, getEdgesData } from './utils'

const Graph = observer(() => {
  const { graph, model } = useStore()

  useEffect(() => {
    model.fetchTablesData()
  }, [])

  const onLoaded = (canvas) => {
    graph.setCanvas(canvas)
    initCanvas()
  }

  const dataProps = {
    nodes: getNodesData(model.tables),
    edges: getEdgesData([]),
  }

  if (!model.tables.length && model.loading) {
    return null
  }

  return (
    <S.GraphWrap className={`${graph.readOnly ? 'read-only' : ''}`}>
      <Butterfly {...dataProps} options={options} onLoaded={onLoaded} />
    </S.GraphWrap>
  )
})

export default Graph
