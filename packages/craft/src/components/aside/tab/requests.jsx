import { observer } from 'mobx-react'
import React from 'react'

import List from '../list'
import { useAsideStore } from '../store'

export default observer(() => {
  const { requests = [], setRequests } = useAsideStore()

  const getControls = () => {
    const controls = [
      {
        type: 'hidden',
        name: 'id',
        label: 'id',
      },
      {
        type: 'text',
        name: 'label',
        label: '请求名',
        required: true,
      },
      {
        type: 'text',
        name: 'url',
        label: '请求地址',
        required: true,
      },
      {
        type: 'button-group',
        name: 'method',
        label: '请求方式',
        value: 'GET',
        options: [
          {
            label: 'GET',
            value: 'GET',
          },
          {
            label: 'POST',
            value: 'POST',
          },
          {
            label: 'PUT',
            value: 'PUT',
          },
          {
            label: 'DELETE',
            value: 'DELETE',
          },
        ],
      },
      {
        type: 'button-group',
        name: 'dataType',
        label: '数据格式',
        value: 'json',
        options: [
          {
            label: 'JSON',
            value: 'json',
          },
          {
            label: 'FormData',
            value: 'form-data',
          },
          {
            label: 'Form',
            value: 'form',
          },
        ],
      },
    ]

    return controls
  }

  const listProps = {
    getControls,
    title: '请求配置',
    list: requests.toJSON(),
    onListChange: (list) => {
      setRequests(list)
    },
  }

  return <List {...listProps} />
})
