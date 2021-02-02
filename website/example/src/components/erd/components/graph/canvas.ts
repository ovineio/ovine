import { isEmpty } from 'lodash'
import { useEffect } from 'react'

import { setGlobal } from '@core/utils/store'

import { erdBfEvents, erdStoreKey } from '../../constants'

import { store, useStore } from '../../sotre'

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
}

export const useCanvas = (callback: any, deeps = []) => {
  const { canvas } = useStore()
  useEffect(() => {
    if (!isEmpty(canvas) && callback) {
      callback(canvas)
    }
  }, [canvas, ...deeps])

  return canvas
}

export const initCanvas = () => {
  const { canvas, setActiveId } = store

  // canvas.focusCenterWithAnimate(); // TODO: 有BUG，导致第一次 连线出现异常
  canvas.setMinimap(true)
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
    setActiveId('')
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
