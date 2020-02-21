import { uuid } from 'amis/lib/utils/helper'

import { MockListStore } from '~/utils/mock'
import { choice } from '~/utils/tool'

// TODO:
// 1. 优化mock重复逻辑, errorData, successData

const getNow = () => Date.now() / 1000

const generator = (i: number) => ({
  id: i,
  name: `名称-${i}`,
  token: uuid(),
  cat: choice(['普通', '一般', '高级']),
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  update_at: getNow(),
  create_at: getNow(),
})

const initItem = generator(0)

type ReqParams = typeof initItem

const mockStore = new MockListStore<any, Partial<ReqParams>>({ generator })

const mockSource: Req.MockSource<{}, ReqParams> = {
  'GET api/v1/start_demo': () => {
    const items = mockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
  'PUT api/v1/start_demo/$id': ({ data = initItem }) => {
    return mockStore.updateById(data, {
      updater: {
        update_at: getNow(),
      },
    })
  },
  'POST api/v1/start_demo': ({ data = initItem }) => {
    return mockStore.add(data, {
      updater: {
        update_at: getNow(),
        create_at: getNow(),
      },
    })
  },
  'DELETE api/v1/start_demo/$id': ({ data = initItem }) => {
    return mockStore.deleteById(data, {})
  },
}

export default mockSource
