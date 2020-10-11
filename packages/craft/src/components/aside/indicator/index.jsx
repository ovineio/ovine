/**
 * 所有容器 可以添加 组件的 迷你指示器
 * 用户可以根据对应的 提示，在合适的地方添加组件
 *
 * 要针对每个容器写对应的指示器
 *
 */

import { uuid } from 'amis/lib/utils/helper'
import _ from 'lodash'
import React, { useEffect } from 'react'

import { useSubscriber, useImmer } from '@core/utils/hooks'

import { previewStore } from '@/components/preview/store'
import { message } from '@/constants'

import Page from './page'

const Containers = {
  Page,
}

export default () => {
  const [state, setState] = useImmer({})

  const { refreshKey = '', info = {} } = state

  const Component = Containers[_.upperFirst(_.camelCase(info.type))]

  useSubscriber([message.updateSelected, message.onNodeAction], () => {
    setState((d) => {
      d.refreshKey = uuid()
    })
  })

  useEffect(() => {
    setState((d) => {
      d.info = previewStore.selectedInfo
    })
  }, [refreshKey])

  if (!Component) {
    return null
  }

  return <Component info={info} />
}
