import { storage } from '@core/constants'
import { ReqMockSourceGen } from '@core/utils/request/types'
import { getStore } from '@core/utils/store'

// 开发时使用的全部权限
const fakeLimit =
  '/dashboard,/start,/system,/system/user_list,/system/user_limit,/system/user_log,/system/user_list/$page,/system/user_list/viewItem,/system/user_list/addItem,/system/user_list/editItem,/system/user_list/editConfig,/system/user_list/delItem,/system/user_limit/$page,/system/user_limit/viewItem,/system/user_limit/addItem,/system/user_limit/editConfig,/system/user_limit/editItem,/system/user_limit/delItem'

const fakeUserData = {
  avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
  nickname: '梦醒十分2',
  signature: '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
  limit: getStore(storage.dev.limit) || fakeLimit,
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
