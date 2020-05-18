import { times } from 'lodash'

export const commonMock = {
  sysRoleId: () => {
    return {
      data: {
        list: times(20, (i) => ({
          id: i,
          name: `角色-${i}`,
        })),
      },
    }
  },
  sysUserInfo: ({ data = {} }: any) => {
    return {
      data: {
        avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
        id: data.id,
        username: 'userLoginUsername',
        nickname: '你好啊',
        signature: '超级想睡觉，超级想睡觉超级想睡觉超级想睡觉超级想睡觉。',
        remark: '这个家伙就知道睡觉。',
        updateTime: Date.now() / 1000,
      },
    }
  },
}
