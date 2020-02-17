import { Spinner } from 'amis'
import React, { useEffect, useState } from 'react'

import { layoutLoading } from '~/constants/msg_key'
import { useSubscriber } from '~/utils/hooks'

import { toggleLayoutLoading } from './layout_util'

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

export const LayoutLoading = () => {
  const [loading, setLoading] = useState(false)

  useSubscriber(layoutLoading, (toggle: boolean) => {
    setLoading(toggle)
  })

  return <Spinner overlay show={loading} size="lg" key="pageLoading" />
}
