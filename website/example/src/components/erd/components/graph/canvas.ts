import { setGlobal } from '@core/utils/store'

import { erdBfEvents, erdStoreKey } from '../../constants'

import { store } from '../../store'

export const options = {
  disLinkable: false, // 可删除连线
  linkable: true, // 可连线
  draggable: true, // 可拖动
  zoomable: true, // 可放大
  moveable: true, // 可平移
  theme: {
    edge: {
      type: 'Manhattan',
      arrow: false,
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
      width: 512,
      height: 205,
      begin: [10, 10],
      preventOverlap: true,
      nodeSize: 120,
      preventOverlapPadding: 10,
    },
  },
}

export const initCanvas = () => {
  const {
    graph: { canvas },
    // setActiveId,
    // setActiveFieldId,
  } = store

  // canvas.focusCenterWithAnimate(); // TODO: 有BUG，导致第一次 连线出现异常
  canvas.setMinimap(true, {
    height: 150,
    width: 150,
  })
  // canvas.setSelectMode(true);
  // canvas.setGirdMode(true, {
  //   isAdsorb: false,         // 是否自动吸附,默认关闭
  //   theme: {
  //     shapeType: 'line',     // 展示的类型，支持line & circle
  //     gap: 16,               // 网格间隙
  //     adsorbGap: 8,          // 吸附间距
  //     background: '#000',     // 网格背景颜色
  //     lineColor: '#e0e0e0',     // 网格线条颜色
  //     lineWidth: 1,          // 网格粗细
  //     // circleRadiu: 1,        // 圆点半径
  //     // circleColor: '#000'    // 圆点颜色
  //   }
  // });

  canvas.on(erdBfEvents.canvasClick, () => {
    // setActiveId('')
    // setActiveFieldId('')
  })

  // canvas.on(erdBfEvents.dragStart, (data: any) => {
  // const { dragType, dragEndpoint } = data
  // const isDragEp = dragType === 'endpoint:drag'
  //   erdStoreKey.epDragSource,
  //   !isDragEp
  //     ? {}
  //     : {
  //         id: dragEndpoint.id,
  //         nodeId: dragEndpoint._node.id,
  //       }
  // )
  // })

  // canvas.on(erdBfEvents.dragEnd, (data) => {
  //   setGlobal(erdStoreKey.epDragSource, {})
  // })

  canvas.on(erdBfEvents.linkConnect, ({ links }) => {
    links.forEach((link) => {
      const { id, sourceNode, targetNode } = link

      // 1.删除相同节点连接 2. 删除自动连接 3. 删除同一字段，不同方向的连接
      if (sourceNode === targetNode || id.indexOf('~') === -1) {
        canvas.removeEdge(id)
      }
    })
  })

  canvas.on('InnerEvents', (event) => {
    const { type, data } = event
    switch (type) {
      case erdBfEvents.endpointDrag:
        // console.log('data--->',data)
        setGlobal(erdStoreKey.epDragSource, { id: data.id, nodeId: data._node.id })
        break
      default:
    }
  })
}

export const calcEdgePoint = () => {
  //
}
