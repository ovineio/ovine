import { Spinner } from 'amis'
import React, { useEffect, useState } from 'react'

import { layoutLoading } from '~/constants/msg_key'
import { useSubscriber } from '~/utils/hooks'
import { store } from '~/utils/message'

export const toggleLayoutLoading = (toggle: boolean) => {
  store[layoutLoading] = toggle
}

export const LayoutLazyFallback = () => {
  useEffect(() => {
    let closed = false

    // 不显示 50 毫秒内的 loading
    setTimeout(() => {
      toggleLayoutLoading(!closed && true)
    }, 50)

    return () => {
      closed = true
      toggleLayoutLoading(false)
    }
  }, [])

  return null
}

// TODO: 优化首次进入时 loading 卡顿
export const LayoutLoading = () => {
  const [loading, setLoading] = useState(false)

  useSubscriber(layoutLoading, (toggle: boolean) => {
    setLoading(toggle)
  })

  return <Spinner overlay show={loading} size="lg" key="pageLoading" />
}
