import { uuid } from 'amis/lib/utils/helper'

import { includes } from 'lodash'

import { MockListStore } from '@core/utils/mock'

const roleGenerator = (i) => ({
  id: i + 10,
  name: `角色-${i + 10}`,
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  updateTime: Date.now() / 1000,
  createTime: Date.now() / 1000,
})
const defRoleItem = roleGenerator(0)
const roleMockStore = new MockListStore({ generator: roleGenerator })

const memberGenerator = (i) => ({
  id: i + 10,
  username: uuid(),
  nickname: `名称-${i}`,
  avatar: 'https://static.igroupes.com/default_avatar.jpg',
  roleId: i + 10,
  roleName: `角色-${i + 10}`,
  desc:
    '描述文案一大堆，描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆描述文案一大堆',
  updateTime: Date.now() / 1000,
  createTime: Date.now() / 1000,
})

const memberMockStore = new MockListStore({ generator: memberGenerator })

let mockLimitStore = {}

const mockSource = {
  'GET ovapi/system/role/item': () => {
    const items = roleMockStore.search()
    return {
      data: {
        items,
        total: items.length,
      },
    }
  },
  'POST ovapi/system/role/item': ({ data = defRoleItem }) => {
    return roleMockStore.add(data, {
      updater: {
        updateTime: Date.now() / 1000,
        createTime: Date.now() / 1000,
      },
    })
  },
  'PUT ovapi/system/role/item/$id': ({ data = defRoleItem }) => {
    return roleMockStore.updateById(data, {
      updater: {
        updateTime: Date.now(),
      },
    })
  },
  'DELETE ovapi/system/role/item/$id': ({ data = defRoleItem }) => {
    return roleMockStore.deleteById(data, {})
  },
  'GET ovapi/system/role/item/$id/limit': () => {
    return {
      data: mockLimitStore,
    }
  },
  'PUT ovapi/system/role/item/$id/limit': ({ data }) => {
    mockLimitStore = data
    return {
      code: 0,
    }
  },
  'GET ovapi/system/user/item': ({ data }) => {
    const items = memberMockStore.search((list) => list.slice(0, data.size))
    return {
      data: {
        items,
        total: memberMockStore.getList().length,
      },
    }
  },
  'PUT ovapi/system/role/member': ({ data }) => {
    const { userIds, roleId } = data
    const list = memberMockStore.getList()
    memberMockStore.setList(
      list.map((i) => {
        if (!includes(userIds, i.id)) {
          return i
        }
        return {
          ...i,
          roleId,
          roleName: roleMockStore.getList().find((r) => r.id === roleId)?.name,
        }
      })
    )

    return { code: 0 }
  },
}

export default mockSource
