// 自定义的API

import mockSource from './mock'

export const apis = {
  sysRoleId: {
    url: 'GET ovapi/system/role/filter',
    sourceKey: 'data.items',
    mockSource,
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
    url: 'GET ovapi/system/user/item/$id',
    api: 'GET ovapi/system/user/item/$id',
    mockSource,
  },
}
