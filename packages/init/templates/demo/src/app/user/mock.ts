/**
 * 用户模块MOCK数据
 */

import { ReqMockSourceGen } from '@core/utils/request/types'

// 根权限标示，拥有任何权限，mock 实在不好模拟多用户 权限相关内容，干脆返回根权限
const fakeLimit = '*'

const fakeUserData = {
  avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
  nickname: '梦醒十分2',
  signature: '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
  limit: fakeLimit,
}

export const userMock: ReqMockSourceGen<any> = {
  'POST ovapi/user/login': () => {
    // return {
    //   code: 1,
    //   message: '模拟登录出错'
    // }

    return {
      code: 0,
      data: {
        key: 'X-TOKEN',
        token: 'mockToken',
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
      data: fakeUserData,
    }
  },
  'PUT ovapi/user/info': ({ data }) => {
    Object.assign(fakeUserData, data)
    return {
      code: 0,
    }
  },
  'PUT ovapi/user/password': () => {
    return {
      code: 0,
    }
  },
}
