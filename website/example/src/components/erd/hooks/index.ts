import { useEffect } from 'react'

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
