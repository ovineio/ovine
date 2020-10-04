/**
 * 所有容器 可以添加 组件的 迷你指示器
 * 用户可以根据对应的 提示，在合适的地方添加组件
 *
 * 要针对每个容器写对应的指示器
 *
 */

import React, { useState } from 'react'
import _ from 'lodash'

import { useSubscriber } from '@core/utils/hooks'

import { message } from '@/constants'

import Page from './page'

const Containers = {
  Page,
}

export default () => {
  const [type, setType] = useState('')

  const Component = Containers[_.upperFirst(_.camelCase(type))]

  useSubscriber(message.updateSelected, (info) => {
    setType(info.type || '')
  })

  if (!Component) {
    return null
  }

  return <Component />
}
