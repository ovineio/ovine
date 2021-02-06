import { observer } from 'mobx-react'
import React, { useRef } from 'react'

import { getGlobal, setGlobal } from '@core/utils/store'

import { erdStoreKey } from '../../constants'
import { useCanvas, useIndeedClick } from '../../hooks'
import { store, useStore } from '../../store'

import { NoFields } from '../state/null_data'
import * as S from './styled'

// const nodeW = 220

// 字段
const Field = observer((props) => {
  const { nodeId, info } = props
  const { name, typeLabel, id } = info

  const { activeFieldId, setActiveFieldId, graph } = useStore()
  const { canActiveItem } = graph

  const isActive = activeFieldId === id

  // 每次点击时 sourceL
  const onFieldMouseDown = () => {
    setGlobal(erdStoreKey.epDragSource, {})
  }

  // 当鼠标字段悬浮时，松开鼠标
  const onFieldMouseUp = () => {
    const { id: dragSourceEpId, nodeId: sourceNodeId } = getGlobal(erdStoreKey.epDragSource) || {}

    if (!dragSourceEpId || !canActiveItem) {
      return
    }

    const { canvas } = store.graph
    const sourceNode = canvas.getNode(sourceNodeId)
    const targetNode = canvas.getNode(nodeId)

    // const sourceL = sourceNode.left
    // const targetL = targetNode.left

    // const diffSl = Math.abs(sourceL - targetL)
    // const diffSr = Math.abs(sourceL + nodeW - targetL)

    // const sourceEp = null
    // const targetEp = null

    const source = `${dragSourceEpId}`
    const target = `${nodeId}-${id}-l`

    setGlobal(erdStoreKey.epDragSource, {})

    canvas.addEdge({
      id: `${source}~${target}`,
      type: 'endpoint',
      // Class: BaseEdge,
      source,
      target,
      sourceNode,
      targetNode,
    })
  }

  // 点击关联逻辑
  const onFieldClick = () => {
    setActiveFieldId(isActive ? '' : id)
    //
  }

  const onFieldMouseEnter = () => {
    // setHoverId(id)
  }

  return (
    <div
      className={`field-wrap ${isActive ? 'active' : ''}`}
      onMouseEnter={onFieldMouseEnter}
      onMouseDown={onFieldMouseDown}
      onMouseUp={onFieldMouseUp}
      onClick={onFieldClick}
    >
      <div className="field-point point-l" data-nid={id} id={`${nodeId}-${id}-l`} />
      <div className="field-content">
        <div className="content">
          <span className="icon" />
          <span>{name}</span>
        </div>
        <span className="type">{typeLabel}</span>
      </div>
      <div className="field-point point-r" data-nid={id} id={`${nodeId}-${id}-r`} />
    </div>
  )
})

// 节点
const Node = observer((props) => {
  const { activeId, setActiveId, setActiveFieldId, graph } = useStore()
  const { canActiveItem } = graph

  const $tableRef = useRef()
  const storeRef = useRef({
    // isMounted: false,
    isMoving: false,
    pointList: [],
  })

  const { id, data } = props
  const { name, fields = [] } = data || {}
  const isActive = id === activeId

  const onNodeClick = (e) => {
    if (canActiveItem) {
      setActiveId(id)
      if (e.target.className === 'header') {
        setActiveFieldId()
      }
    }
  }

  const { onMouseDown, onMouseUp } = useIndeedClick({
    onIndeedClick: onNodeClick,
  })

  useCanvas((canvas) => {
    const { pointList } = storeRef.current
    const $table = $($tableRef.current)

    if ($tableRef.current) {
      const bfNode = canvas.getNode(id)
      $table.find('.field-point').each((__, $point) => {
        const pointId = $point.id
        if (!pointList.includes(pointId)) {
          bfNode.addEndpoint({
            id: pointId,
            dom: $point,
            orientation: $point.className.indexOf('point-l') > -1 ? [-1, 0] : [1, 0],
          })
        }
      })
    }
  })

  return (
    <S.NodeWrap
      ref={$tableRef}
      className={`table ${isActive ? 'active' : ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div>
        <div className="header">{name}</div>
        {fields.length ? (
          fields.map((field) => {
            return <Field key={field.id} nodeId={id} info={field} />
          })
        ) : (
          <NoFields />
        )}
      </div>
    </S.NodeWrap>
  )
})

const NodeWrap = (props) => <Node {...props} />

export default NodeWrap
