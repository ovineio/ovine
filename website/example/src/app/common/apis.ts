// 自定义的API

import { commonMock } from './mock'

export const apis = {
  sysRoleId: {
    url: 'GET rtapi/system/role/filter',
    mockSource: commonMock,
  },
  sysUserInfo: {
    url: 'GET rtapi/system/user/item/$id',
    mockSource: commonMock,
  },
}
