import { Spinner } from 'amis'
import React, { useEffect, useState } from 'react'

import { message } from '@/constants'
import { useSubscriber } from '@/utils/hooks'

import { toggleLayoutLoading } from './exports'

export const LayoutLazyFallback = () => {
  useEffect(() => {
    let closed = false

    // 不显示 50 毫秒内的 loading
    setTimeout(() => {
      toggleLayoutLoading(!closed)
    }, 100)

    return () => {
      closed = true
      toggleLayoutLoading(false)
    }
  }, [])

  return null
}

export const LayoutLoading = ({ theme }: any) => {
  const [loading, setLoading] = useState(false)

  useSubscriber(message.layoutSpinner, (toggle: boolean) => {
    setLoading(toggle)
  })

  return <Spinner overlay show={loading} theme={theme} size="lg" key="pageLoading" />
}
