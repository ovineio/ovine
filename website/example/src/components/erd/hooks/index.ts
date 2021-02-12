import { useEffect, useRef } from 'react'

import { useStore } from '../store'

export const useCanvas = (callback: any) => {
  const {
    graph: { canvas },
  } = useStore()

  useEffect(() => {
    if (canvas && callback) {
      callback(canvas)
    }
  }, [])

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

    if (options.onMouseUp) {
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

type compareFunction<T> = (prev: T | undefined, next: T) => boolean
export function usePrevious<T>(state: T, compare?: compareFunction<T>): T | undefined {
  const prevRef = useRef<T>()
  const curRef = useRef<T>()

  const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true
  if (needUpdate) {
    prevRef.current = curRef.current
    curRef.current = state
  }

  return prevRef.current
}
