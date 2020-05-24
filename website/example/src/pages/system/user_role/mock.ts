import { uuid } from 'amis/lib/utils/helper'

import { MockListStore } from '@core/utils/mock'

const generator = (i) => ({
  id: i,
  name: uuid(),
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  updateTime: Date.now(),
  createTime: Date.now(),
})

const defaultItem = generator(0)

const mockStore = new MockListStore({ generator })

const mockSource = {
  'GET ovapi/system/role/item': () => {
    const items = mockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
  'POST ovapi/system/role/item/$id': ({ data = defaultItem }) => {
    return mockStore.updateById(data, {
      updater: {
        createTime: Date.now(),
      },
    })
  },
  'PUT ovapi/system/role/item/$id': ({ data = defaultItem }) => {
    return mockStore.add(data, {
      updater: {
        updateTime: Date.now(),
      },
    })
  },
  'DELETE ovapi/system/role/item/$id': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
  'GET ovapi/system/role/item/$id/limit': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
  'PUT ovapi/system/role/item/$id/limit': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
  'GET ovapi/system/user/item': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
  'PUT ovapi/system/role/member': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
}

export default mockSource
