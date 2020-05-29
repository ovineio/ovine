import { LimitMenuItem } from '@core/routes/types'

import { apis } from '../common/apis'

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
        sysRoleIdPicker: {
          label: '管理员角色筛选',
          needs: [],
        },
        sysUserInfoModal: {
          label: '管理员信息弹窗',
          needs: [],
        },
      },
      apis: {
        roleId: {
          url: apis.sysRoleId.url,
          limits: 'sysRoleIdPicker',
        },
        userInfo: {
          url: apis.sysUserInfo.url,
          limits: 'sysUserInfoModal',
        },
      },
    },
  ],
}
