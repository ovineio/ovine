import { uuid } from 'amis/lib/utils/helper'

import { MockSource } from '~/core/request'
import { MockListStore } from '~/utils/mock'
import { choice } from '~/utils/tool'

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

type Item = typeof initItem

const mockStore = new MockListStore<Partial<Item>>({ generator })

export const mockSource: MockSource<{}, Item> = {
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
    mockStore.updateById(data, {
      update_at: getNow(),
    })
    return {
      code: 0,
    }
  },
  'POST api/v1/start_demo': ({ data = initItem }) => {
    mockStore.add(data, {
      update_at: getNow(),
      create_at: getNow(),
    })
    return {
      code: 0,
    }
  },
  'DELETE api/v1/start_demo/$id': ({ data = initItem }) => {
    mockStore.deleteById(data)
    return {
      code: 0,
    }
  },
}
