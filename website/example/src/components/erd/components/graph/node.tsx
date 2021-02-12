import cls from 'classnames'
import { debounce, get, map } from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'

import { useImmer } from '@core/utils/hooks'
import { subscribe } from '@core/utils/message'
import { getGlobal, setGlobal } from '@core/utils/store'

import { erdEvents, erdStoreKey } from '../../constants'
import { useIndeedClick } from '../../hooks'
import { store, useStore } from '../../store'

import { NoField } from '../state/null_data'
import { PointEdge } from './edge'
import * as S from './styled'

// const nodeW = 220

// 字段
const Field = observer((props) => {
  const { nodeId, field, epCls } = props
  const { name, typeLabel, id } = field

  const { activeFieldId, setActiveFieldId, canEditItem, graph } = useStore()

  const { canvas } = graph
  const isActive = activeFieldId === id
  const lEpId = `${nodeId}-${id}-l`
  const rEpId = `${nodeId}-${id}-r`

  // 每次点击时 sourceL
  const onFieldMouseDown = () => {
    if (!$('#erd-graph-wrap .field-point.active').length) {
      setGlobal(erdStoreKey.epDragSource, {})
    }
  }

  // 当鼠标字段悬浮时，松开鼠标
  const onFieldMouseUp = () => {
    const { id: dragSourceEpId, nodeId: sourceNodeId } = getGlobal(erdStoreKey.epDragSource) || {}

    if (!dragSourceEpId || !canEditItem) {
      return
    }

    const sourceNode = canvas.getNode(sourceNodeId)
    const targetNode = canvas.getNode(nodeId)

    const sourceL = dragSourceEpId.indexOf('-l') > -1 ? sourceNode.left : sourceNode.left + 220
    const targetL = targetNode.left
    const targetR = targetNode.left + 220

    const diffSl = Math.abs(sourceL - targetL)
    const diffSr = Math.abs(sourceL - targetR)

    const source = `${dragSourceEpId}`
    // 计算 结束 节点  的 方向
    const target = `${nodeId}-${id}-${diffSl < diffSr ? 'l' : 'r'}`
    const edgeId = `${source}~${target}`

    setGlobal(erdStoreKey.epDragSource, {})

    canvas.addEdge({
      source,
      target,
      sourceNode,
      targetNode,
      id: edgeId,
      type: 'endpoint',
      Class: PointEdge,
      relationType: 'oneToOne',
    })
  }

  // 点击关联逻辑
  const onFieldClick = () => {
    setActiveFieldId(isActive ? '' : id)
  }

  const { onMouseDown, onMouseUp } = useIndeedClick({
    onMouseDown: onFieldMouseDown,
    onMouseUp: onFieldMouseUp,
    onIndeedClick: onFieldClick,
  })

  //
  const onFieldMouseEnter = () => {
    // setHoverId(id)
  }

  return (
    <div
      className={cls('field-wrap', isActive ? 'active' : 'normal')}
      onMouseEnter={onFieldMouseEnter}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div
        className={cls('field-point point-l', { 'field-point-active': epCls[lEpId] })}
        data-fid={id}
        data-id={lEpId}
      >
        <div id={lEpId} />
      </div>
      {epCls[lEpId] && <div className="field-mark mark-l mark-point" />}
      <div className="field-content">
        <div className="content">
          <span className="icon" />
          <span>{name}</span>
        </div>
        <span className="type">{typeLabel}</span>
      </div>
      {epCls[rEpId] && <div className="field-mark mark-r mark-point" />}
      <div
        className={cls('field-point point-r', { 'field-point-active': epCls[rEpId] })}
        data-fid={id}
        data-id={rEpId}
      >
        <div id={rEpId} />
      </div>
    </div>
  )
})

// 节点
const Node = observer((props) => {
  const { id, data } = props
  const { name, fields = [], refreshKey } = data || {}

  const {
    activeId,
    aside,
    canActiveItem,
    canEditItem,
    activeNodeInfo,
    graph,
    setActiveId,
    setActiveFieldId,
  } = useStore()

  const { withSearch, sortToggle } = aside
  const { canvas } = graph

  const $tableRef = useRef()
  const [state, setState] = useImmer<any>({
    epCls: {},
  })

  const isActive = id === activeId
  const { epCls = {} } = state

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

  const setEndpointCls = () => {
    const { edges = [] } = store.graph.canvas || {}
    const clsMap = {}
    edges.forEach((edge) => {
      const { id: edgeId } = edge

      // const type = options.relationType || ''

      fields.forEach((field) => {
        const lEpId = `${id}-${field.id}-l`
        const rEpId = `${id}-${field.id}-r`

        if (edgeId.indexOf(lEpId) > -1) {
          clsMap[lEpId] = true
        } else if (edgeId.indexOf(rEpId) > -1) {
          clsMap[rEpId] = true
        }
      })
    })
    setState((d) => {
      d.epCls = clsMap
    })
  }

  useEffect(() => {
    subscribe(
      erdEvents.updateEpCls,
      debounce(({ nodeIds = [], endpointIds }) => {
        if (nodeIds.includes(id)) {
          if (endpointIds) {
            setState((d) => {
              map(endpointIds, (val, key) => {
                d.epCls[key] = val
              })
            })
          } else {
            setEndpointCls()
          }
        }
      }, 200)
    )
  }, [])

  useEffect(() => {
    const $table = $($tableRef.current)

    if (!$tableRef.current || !canvas) {
      return
    }

    setEndpointCls()
    const bfNode = canvas.getNode(id)
    let isUpdateIdx = false

    $table.find('.field-point').each((index, pointDom) => {
      const pointId = pointDom.dataset.id
      const epDom = $(pointDom).find('div')[0]
      const pointIdx = `${Math.floor(index / 2)}`
      const oldPoint = bfNode.getEndpoint(pointId)
      const oldPointIdx = get(oldPoint, 'options.index')
      const updateIndex = (oldPoint && pointIdx === oldPointIdx) === false
      if (updateIndex) {
        oldPoint.updatePos(epDom)
        oldPoint.options.index = pointIdx
        isUpdateIdx = true
        return
      }

      if (!oldPoint) {
        bfNode.addEndpoint({
          id: pointId,
          fieldId: pointDom.dataset.fid,
          index: pointIdx,
          // 防止删除 endpoint 会 将 锚点位置删除
          dom: epDom,
          orientation: pointDom.className.indexOf('point-l') > -1 ? [-1, 0] : [1, 0],
        })
      }
    })

    if (isUpdateIdx) {
      canvas.edges.forEach((edge) => {
        edge.redraw()
      })
    }
  }, [fields, refreshKey, canvas])

  return (
    <S.NodeWrap
      ref={$tableRef}
      className={`table ${isActive ? 'active' : 'normal'} ${
        canEditItem ? 'editable' : 'read-only'
      }`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div>
        <div className="header">{name}</div>
        {fields.length ? (
          fields.map((field, index) => {
            return <Field key={field.id} nodeId={id} index={index} epCls={epCls} field={field} />
          })
        ) : (
          <NoField
            type={withSearch ? 'search' : sortToggle ? 'sort' : 'add'}
            batchAddFields={activeNodeInfo?.batchAddFields}
          />
        )}
      </div>
    </S.NodeWrap>
  )
})

const NodeWrap = (props) => <Node {...props} />

export default NodeWrap
