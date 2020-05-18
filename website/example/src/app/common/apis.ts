// 自定义的API

import { commonMock } from './mock'

export const apis = {
  sysRoleId: {
    url: 'GET rtapi/system/role/filter',
    sourceKey: 'data.items',
    mockSource: commonMock.sysRoleId,
    onSuccess: (source = []) => {
      const options = source.map((i = {}) => {
        return {
          label: `${i.name} (${i.id})`,
          value: i.id,
        }
      })
      return {
        code: 0,
        data: { options },
      }
    },
  },
  sysUserInfo: {
    url: 'GET rtapi/system/user/item/$id',
    mockSource: commonMock.sysUserInfo,
  },
}
