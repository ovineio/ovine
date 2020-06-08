import { uuid } from 'amis/lib/utils/helper'

import { MockListStore } from '@core/utils/mock'

const generator = (i) => ({
  id: i + 20,
  createTime: Date.now() / 1000,
  actionAddr: uuid(),
  handlerId: i,
  handlerName: `名称-${i + 20}`,
  result: 0,
  failDesc: 'failDesc',
  detail: { mockLog: { id: i + 20 } },
})

const mockStore = new MockListStore({ generator })

const mockSource = {
  'GET ovapi/system/log/item': () => {
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
