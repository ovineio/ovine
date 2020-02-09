import { Spinner } from 'amis'
import React, { useEffect, useState } from 'react'

import { layoutLoading } from '~/constants/msg_key'
import { on, store } from '~/utils/message'

export const LayoutLazyFallback = () => {
  useEffect(() => {
    let closed = false
    // 不显示 50 毫秒内的 loading
    setTimeout(() => {
      store[layoutLoading] = !closed && true
    }, 50)
    return () => {
      closed = true
      store[layoutLoading] = false
    }
  })
  return null
}

// TODO: 优化首次进入时 loading 卡顿
export const LayoutLoading = () => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { off } = on(layoutLoading, (toggle) => {
      setLoading(toggle)
    })
    return off
  }, [])

  return <Spinner overlay show={loading} size="lg" key="pageLoading" />
}
