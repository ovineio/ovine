import { includes } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import List from '../list'
import { useAsideStore } from '../store'

export default observer(() => {
  const { limits = [], setLimits } = useAsideStore()

  const getControls = (info) => {
    const { list, editId } = info
    const controls = [
      {
        type: 'hidden',
        name: 'id',
        label: 'id',
      },
      {
        type: 'text',
        name: 'label',
        label: '权限名',
        required: true,
      },
      {
        type: 'select',
        name: 'needs',
        label: '依赖列表',
        multiple: true,
        options: list
          .filter(({ needs, id }) => !includes(needs, editId) && editId !== id)
          .map((i) => ({
            label: i.label,
            value: i.id,
          })),
      },
    ]

    return controls
  }

  const listProps = {
    getControls,
    title: '权限配置',
    list: limits.toJSON(),
    onListChange: (list) => {
      setLimits(list)
    },
  }

  return <List {...listProps} />
})
