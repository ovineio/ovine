import { openContextMenus } from 'amis'
import { debounce, get } from 'lodash'

import { publish } from '@core/utils/message'
import { setGlobal } from '@core/utils/store'

import { erdBfEvents, erdEvents, erdOther, erdStoreKey } from '../../constants'
import { store } from '../../store'

export const canvasOpts = {
  disLinkable: false, // 可删除连线
  linkable: true, // 可连线
  draggable: true, // 可拖动
  zoomable: true, // 可放大
  moveable: true, // 可平移
  theme: {
    edge: {
      type: 'AdvancedBezier',
      arrow: false,
      isExpandWidth: true,
    },
    // 拖动边缘处自动适应画布
    autoFixCanvas: {
      enable: true,
    },
  },
  layout: {
    // TODO: 优化自动布局算法
    type: 'gridLayout',
    options: {
      width: 350,
      height: 205,
      begin: [10, 10],
      center: [200, 200],
      preventOverlap: true,
      nodeSize: 120,
      preventOverlapPadding: 10,
    },
  },
}

export const initCanvas = () => {
  const { graph } = store
  const { canvas } = graph

  // canvas.focusCenterWithAnimate(); // TODO: 有BUG，导致第一次 连线出现异常
  canvas.setMinimap(true, {
    height: 150,
    width: 150,
  })

  canvas.on(erdBfEvents.linkConnect, ({ links }) => {
    links.forEach((link) => {
      const { id, sourceEndpoint: sep, targetEndpoint: tep, sourceNode, targetNode } = link
      const sId = sourceNode.id
      const tId = targetNode.id
      const sepFieldId = sep.options.fieldId
      const tepFieldId = tep.options.fieldId

      if (sep.id === tep.id && store.canEditItem) {
        rmActiveEndpoint()
        setGlobal(erdStoreKey.epDragSource, {
          id: sep.id,
          nodeId: sId,
        })
        $(sep.dom)
          .parent()
          .addClass('active')
      }

      // 1.删除相同节点连接 2. 删除自动连接 3. 删除同一字段，不同方向的连接
      const hasShadow = canvas.edges.some(({ id: eId }) => {
        return (
          eId !== id &&
          eId.indexOf(`${sId}-${sepFieldId}-`) > -1 &&
          tId.indexOf(`${eId}-${tepFieldId}-`) > -1
        )
      })
      if (sId === tId || id.indexOf('~') === -1 || hasShadow) {
        canvas.removeEdge(id)
      } else {
        rmActiveEndpoint()
        updateEpCls({ edge: link, toggle: true })
      }
    })
  })

  canvas.on(erdBfEvents.linkDel, ({ links }) => {
    links.forEach((edge) => {
      updateEpCls({ edge, toggle: false })
    })
  })

  canvas.on('InnerEvents', (event) => {
    const { type, data } = event
    switch (type) {
      case erdBfEvents.endpointDrag:
        setGlobal(erdStoreKey.epDragSource, { id: data.id, nodeId: data._node.id })
        break
      default:
    }
  })
}

export const rmActiveEndpoint = () => {
  setGlobal(erdStoreKey.epDragSource, {})
  $('#erd-graph-wrap .field-point.active').removeClass('active')
}

const updateEpCls = (options: any) => {
  const { edge = {}, toggle = false } = options

  publish(erdEvents.updateEpCls, {
    nodeIds: [edge.sourceNode.id, edge.targetNode.id],
    endpointIds: {
      [edge.sourceEndpoint.id]: toggle,
      [edge.targetEndpoint.id]: toggle,
    },
  })
}

export const bindShowLineTip = () => {
  const $svg = $('.butterfly-svg')
  let $tip = null

  $svg
    .on('mouseenter', '.point-path-handler', (e) => {
      const { pageX, pageY, target } = e
      const edge = store.graph.canvas.getEdge(target.dataset.id)
      const type = get(edge, 'options.relationType') || 'oneToOne'
      const label = get(
        erdOther.epRelation.find(({ key }) => key === type),
        'label'
      )

      const top = pageY - 40
      const left = pageX - 20

      $tip = $(`
      <div class="butterfly-tooltip-container butterfly-tips top in " style="top:${top}px;left:${left}px;">
        <div class="butterfly-tooltip-arrow"></div>
        <div class="butterfly-tooltip-inner">${label}</div>
      </div>
      `)
      $tip.appendTo('body')
    })
    .on('mouseleave', '.point-path-handler', () => {
      $tip.removeClass('in').remove()
    })

  return () => {
    $svg.off('mouseenter').off('mouseleave')
  }
}

export const showLineMenu = debounce((options) => {
  const { x, y, id } = options
  const { canvas } = store.graph
  const edge = canvas.getEdge(id)

  const { relationType = '' } = edge?.options || {}

  const menus = []

  erdOther.epRelation.forEach(({ label, key }) => {
    const isActive = key === relationType
    menus.push({
      label,
      className: isActive ? 'active' : '',
      onSelect: () => {
        edge.options.relationType = key
      },
    })
  })

  openContextMenus(
    {
      x,
      y,
    },
    [
      ...menus,
      {
        label: '删除关联',
        onSelect: () => {
          updateEpCls({ edge, toggle: false })
          canvas.removeEdge(id)
        },
      },
    ]
  )
}, 100)

// 当node 移动时，重新计算当前节点 的边连接关系
export const calcEdgeOnNodeMove = () => {
  //
}
