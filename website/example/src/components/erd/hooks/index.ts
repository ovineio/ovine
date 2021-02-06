import { useEffect, useRef } from 'react'

import { useStore } from '../store'

export const useCanvas = (callback: any, deeps: any[] = []) => {
  const {
    graph: { canvas },
  } = useStore()

  useEffect(() => {
    if (canvas && callback) {
      callback(canvas)
    }
  }, [canvas, ...deeps])

  return canvas
}

type ClickOptions = {
  onMouseDown?: (e: React.MouseEvent) => any
  onMouseUp?: (e: React.MouseEvent) => any
  onIndeedClick: (e: React.MouseEvent) => any
}
export const useIndeedClick = (options: ClickOptions) => {
  const ref = useRef({
    mouseDownXY: {
      x: 0,
      y: 0,
    },
  })

  const onMouseDown = (e: React.MouseEvent) => {
    ref.current.mouseDownXY = {
      x: e.pageX,
      y: e.pageY,
    }
    if (options.onMouseDown) {
      options.onMouseDown(e)
    }
  }

  const onMouseUp = (e: React.MouseEvent) => {
    const { pageX, pageY } = e
    const { mouseDownXY } = ref.current

    if (options.onMouseDown) {
      options.onMouseUp(e)
    }

    if (mouseDownXY.x === pageX && mouseDownXY.y === pageY) {
      options.onIndeedClick(e)
    }
  }

  return {
    onMouseDown,
    onMouseUp,
  }
}
