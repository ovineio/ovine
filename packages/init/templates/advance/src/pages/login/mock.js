import { getStore } from '@rtadmin/core/lib/utils/store'

// const store: any = {}

// 开发时使用的全部权限
const fakeLimit = '/dashboard,/start,/system,/system/user_list,/system/user_limit,/system/user_log,/system/user_list/$page,/system/user_list/viewItem,/system/user_list/addItem,/system/user_list/editItem,/system/user_list/editConfig,/system/user_list/delItem,/system/user_limit/$page,/system/user_limit/viewItem,/system/user_limit/addItem,/system/user_limit/editConfig,/system/user_limit/editItem,/system/user_limit/delItem'

const fakeUserData = {
  access_token: 'mock_token_123123',
  avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
  nickname: '梦醒十分2',
  signature: '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
  limit: getStore('devLimitStore') || fakeLimit,
}

export const mockSource = {
  'POST api/v1/login': () => {
    return {
      code: 0,
      data: fakeUserData,
    }
  },
  'GET api/v1/user_info': () => {
    return {
      code: 0,
      data: fakeUserData,
    }
  },
}
