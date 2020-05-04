import { uuid } from 'amis/lib/utils/helper'

import { MockListStore } from '@core/utils/mock'

const generator = (i) => ({
  id: i,
  username: uuid(),
  nickname: `名称-${i}`,
  avatar: 'http://img0.imgtn.bdimg.com/it/u=2939704571,4273557359&fm=26&gp=0.jpg',
  limitName: `权限名称-${i}`,
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  updateTime: Date.now(),
  createTime: Date.now(),
})

const defaultItem = generator(0)

const mockStore = new MockListStore({ generator })

const mockSource = {
  'GET rtapi/system/user': () => {
    const items = mockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
  'POST rtapi/system/user': ({ data = defaultItem }) => {
    return mockStore.updateById(data, {
      updater: {
        createTime: Date.now(),
      },
    })
  },
  'PUT rtapi/system/user/$id': ({ data = defaultItem }) => {
    return mockStore.add(data, {
      updater: {
        updateTime: Date.now(),
      },
    })
  },
  'DELETE rtapi/system/user/$id': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
}

export default mockSource
