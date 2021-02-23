/**
 * 主要功能做 锚点/连线相关 需求
 * 1. 只读--模式，点选---模式
 */

import cls from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'

import Butterfly from '~/components/butterfly'

import { modelUtils } from '../../helper/api'
import { useIndeedClick } from '../../hooks'
import { useStore } from '../../store'

import { bindShowLineTip, initCanvas, canvasOpts, showLineMenu } from './canvas'
import * as S from './styled'
import { getNodesData, addNode } from './utils'

const Graph = observer(() => {
  const { graph, model, clearActive, canEditItem } = useStore()

  const { readMode, addMode } = graph
  const dataProps = {
    nodes: getNodesData(model.tables),
  }

  useEffect(() => {
    modelUtils.fetchModelTplData()
    model.fetchTablesData()

    return () => {
      clearActive()
      $('.butterfly-svg')
        .off('mouseenter')
        .off('mouseleave')
    }
  }, [])

  const onLoaded = (canvasObj) => {
    graph.setCanvas(canvasObj)
    bindShowLineTip()
    initCanvas()
  }

  const onGraphClick = (e) => {
    const isBlankPlace = 'butterfly-wrapper,butterfly-gird-canvas'.indexOf(e.target.className) > -1
    const $target = $(e.target)

    if (canEditItem && $target.hasClass('point-path-handler')) {
      const options = {
        id: $target.data('id'),
        x: e.clientX,
        y: e.clientY,
      }
      showLineMenu(options)
    }

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
      id="erd-graph-wrap"
      className={cls({ 'read-mode': readMode, 'add-mode': addMode })}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Butterfly {...dataProps} options={canvasOpts} onLoaded={onLoaded} />
    </S.GraphWrap>
  )
})

export default Graph
