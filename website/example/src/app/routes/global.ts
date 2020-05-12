import { LimitMenuItem } from '@core/routes/types'

export const globalLimits: LimitMenuItem = {
  nodePath: '/_global',
  limitLabel: '全局权限',
  limitOnly: true,
  label: '',
  icon: 'fa fa-cog',
  children: [
    {
      nodePath: '/system',
      label: '系统信息',
      limits: {
        roleFilter: {
          label: '管理员角色Filter',
        },
        userInfoModal: {
          label: '管理员信息弹窗',
        },
      },
      apis: {
        roleFilter: {
          url: 'GET rtapi/system/role/item',
          limits: 'roleFilter',
        },
        userInfo: {
          url: 'GET rtapi/system/role/item',
          limits: 'userInfoModal',
        },
      },
    },
  ],
}
