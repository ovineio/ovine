import { observer } from 'mobx-react'
import React, { useRef } from 'react'

import { getGlobal, setGlobal } from '@core/utils/store'

import { erdStoreKey } from '../../constants'
import { store, useStore } from '../../sotre'
import { useCanvas } from './canvas'

import * as S from './styled'

// const nodeW = 220

// 字段
const Field = (props) => {
  const { nodeId, readOnly, clickLink } = props
  const { label, type, id } = props.info

  // 每次点击时 sourceL
  const onFieldMouseDown = () => {
    setGlobal(erdStoreKey.epDragSource, {})
  }

  // 当鼠标字段悬浮时，松开鼠标
  const onFieldMouseUp = () => {
    const { id: dragSourceEpId, nodeId: sourceNodeId } = getGlobal(erdStoreKey.epDragSource) || {}

    if (!dragSourceEpId || readOnly || clickLink) {
      return
    }

    const { canvas } = store
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
    if (!clickLink) {
      //
    }
    //
  }

  const onFieldMouseEnter = () => {
    // setHoverId(id)
  }

  return (
    <div
      className="field-wrap"
      onMouseEnter={onFieldMouseEnter}
      onMouseDown={onFieldMouseDown}
      onMouseUp={onFieldMouseUp}
      onClick={onFieldClick}
    >
      <div className="field-point point-l" data-nid={id} data-id={`${nodeId}-${id}-l`} />
      <div className="field-content">
        <div className="content">
          <span className="icon" />
          <span>{label}</span>
        </div>
        <span className="type">{type}</span>
      </div>
      <div className="field-point point-r" data-nid={id} data-id={`${nodeId}-${id}-r`} />
    </div>
  )
}

// 节点
const Node = observer((props) => {
  const { activeId, setActiveId, readOnly, clickLink } = useStore()

  const $tableRef = useRef()
  const storeRef = useRef({
    // isMounted: false,
    isMoving: false,
    pointList: [],
  })

  const { id, data } = props
  const { label, fields = [] } = data || {}
  const isActive = id === activeId

  const onMouseUp = () => {
    if (readOnly || clickLink) {
      return
    }
    if (!storeRef.current.isMoving) {
      setActiveId(id)
    }
  }

  const onMouseMove = () => {
    if (readOnly || clickLink) {
      return
    }
    if (!storeRef.current.isMoving) {
      storeRef.current.isMoving = true
    }
  }

  const onMouseDown = () => {
    if (readOnly || clickLink) {
      return
    }
    storeRef.current.isMoving = false
  }

  useCanvas((canvas) => {
    const { pointList } = storeRef.current
    const $table = $($tableRef.current)

    if ($table) {
      const bfNode = canvas.getNode(id)
      $table.find('.field-point').each((__, $point) => {
        const pointId = $point.dataset.id
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
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div>
        <div className="header">{label}</div>
        {fields.map((field) => {
          return (
            <Field
              key={field.id}
              readOnly={readOnly}
              clickLink={clickLink}
              nodeId={id}
              info={field}
            />
          )
        })}
      </div>
    </S.NodeWrap>
  )
})

const NodeWrap = (props) => <Node {...props} />

export default NodeWrap
