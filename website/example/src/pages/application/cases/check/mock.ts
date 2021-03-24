import { MockListStore } from '@core/utils/mock'

const generator = (i) => ({
  id: i + 100,
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  content: JSON.stringify({ mockData: { id: i + 100 } }),
  updateTime: Date.now() / 1000,
  createTime: Date.now() / 1000,
})

const defaultItem = generator(0)
const mockStore = new MockListStore({ generator })

const mockSource = {
  'GET ovapi/hot_config/item': () => {
    const items = mockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
  'POST ovapi/hot_config/item': ({ data = defaultItem }) => {
    return mockStore.add(data, {
      updater: {
        updateTime: Date.now() / 1000,
      },
    })
  },
  'PUT ovapi/hot_config/item/$id': ({ data = defaultItem }) => {
    return mockStore.updateById(data, {
      updater: {
        createTime: Date.now() / 1000,
        updateTime: Date.now() / 1000,
      },
    })
  },
  'DELETE ovapi/hot_config/item/$id': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
}

export default mockSource
