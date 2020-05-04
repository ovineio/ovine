import { uuid } from 'amis/lib/utils/helper'

import { MockListStore } from '@core/utils/mock'

const generator = (i) => ({
  id: i,
  createTime: Date.now(),
  actionAddr: uuid(),
  handlerId: i,
  handlerName: `名称-${i}`,
  result: 0,
  failDesc: 'failDesc',
  detail:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
})

const mockStore = new MockListStore({ generator })

const mockSource = {
  'GET rtapi/system/log': () => {
    const items = mockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
}

export default mockSource
