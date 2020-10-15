/**
 * 定义一些全局需要的 MOCK 数据
 */

import { times } from 'lodash'

const fakeUserInfo = {
  avatar: 'https://static.igroupes.com/default_avatar.jpg',
  nickname: '梦醒十分2',
  signature: '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
  limit: '*',
}

export default {
  'GET ovapi/system/role/filter': () => {
    return {
      data: {
        list: times(20, (i) => ({
          id: i + 10,
          name: `角色-${i + 10}`,
        })),
      },
    }
  },
  'GET ovapi/system/user/item/$id': ({ data = {} }: any) => {
    return {
      data: {
        avatar: 'https://static.igroupes.com/default_avatar.jpg',
        id: data.id,
        username: 'userLoginUsername',
        nickname: '你好啊',
        signature: '超级想睡觉，超级想睡觉超级想睡觉超级想睡觉超级想睡觉。',
        remark: '这个家伙就知道睡觉。',
        updateTime: Date.now() / 1000,
      },
    }
  },
  'GET ovapi/user/info': () => {
    // return {
    //   code: 10022,
    //   message: '模拟用户token过期',
    // }

    return {
      code: 0,
      data: fakeUserInfo,
    }
  },
  'PUT ovapi/user/info': ({ data }) => {
    Object.assign(fakeUserInfo, data)
    return {
      code: 0,
    }
  },
  'PUT ovapi/user/password': () => {
    return {
      code: 0,
    }
  },
  'POST ovapi/stat/data': () => {
    return {
      code: 0,
    }
  },
}
