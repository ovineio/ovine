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
  'GET rtapi/system/user/item': () => {
    const items = mockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
  'GET rtapi/system/user/tree': () => {
    return {
      data: {
        nickname: 'flare',
        children: [
          {
            nickname: 'flex',
            children: [{ nickname: 'FlareVis', id: 4116 }],
          },
          {
            nickname: 'scale',
            children: [
              { nickname: 'IScaleMap', id: 2105 },
              { nickname: 'LinearScale', id: 1316 },
              { nickname: 'LogScale', id: 3151 },
              { nickname: 'OrdinalScale', id: 3770 },
              {
                nickname: 'QuantileScale',
                id: 2435,
                children: [
                  { nickname: 'IScaleMap', id: 2105 },
                  { nickname: 'LinearScale', id: 1316 },
                  { nickname: 'LogScale', id: 3151 },
                  { nickname: 'OrdinalScale', id: 3770 },
                ],
              },
              { nickname: 'QuantitativeScale', id: 4839 },
              { nickname: 'RootScale', id: 1756 },
              { nickname: 'Scale', id: 4268 },
              { nickname: 'ScaleType', id: 1821 },
              { nickname: 'TimeScale', id: 5833 },
            ],
          },
          {
            nickname: 'display',
            children: [{ nickname: 'DirtySprite', id: 8833 }],
          },
        ],
      },
    }
  },
  'POST rtapi/system/user/item': ({ data = defaultItem }) => {
    return mockStore.updateById(data, {
      updater: {
        createTime: Date.now(),
      },
    })
  },
  'PUT rtapi/system/user/item/$id': ({ data = defaultItem }) => {
    return mockStore.add(data, {
      updater: {
        updateTime: Date.now(),
      },
    })
  },
  'DELETE rtapi/system/user/item/$id': ({ data = defaultItem }) => {
    return mockStore.deleteById(data, {})
  },
}

export default mockSource
