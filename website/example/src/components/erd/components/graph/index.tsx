/**
 * 主要功能做 锚点/连线相关 需求
 * 1. 只读--模式，点选---模式
 */

import cls from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import Butterfly from '~/components/butterfly'

import { useIndeedClick } from '../../hooks'
import { useStore } from '../../store'

import { initCanvas, options } from './canvas'
import * as S from './styled'
import { getNodesData, getEdgesData, addNode } from './utils'

const Graph = observer(() => {
  const { graph, model } = useStore()

  const { readMode, addMode } = graph

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

  const onGraphClick = (e) => {
    const isBlankPlace = 'butterfly-wrapper,butterfly-gird-canvas'.indexOf(e.target.className) > -1
    if (addMode && isBlankPlace) {
      addNode(e)
    }
  }

  const { onMouseDown, onMouseUp } = useIndeedClick({
    onIndeedClick: onGraphClick,
  })

  if (!model.tables.length && model.loading) {
    return null
  }

  return (
    <S.GraphWrap
      className={cls({ 'read-mode': readMode, 'add-mode': addMode })}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Butterfly {...dataProps} options={options} onLoaded={onLoaded} />
    </S.GraphWrap>
  )
})

export default Graph
