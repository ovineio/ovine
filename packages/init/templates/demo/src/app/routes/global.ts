/**
 * 用于全局权限控制
 */

import { LimitMenuItem } from '@core/routes/types'

import { apis } from '../common/apis'

export const globalLimits: LimitMenuItem = {
  nodePath: '/_global',
  limitLabel: '全局权限',
  limitOnly: true, // 仅用作侧边栏权限配置不渲染真实路由
  label: '',
  icon: 'fa fa-cog',
  children: [
    {
      nodePath: '/system',
      label: '系统信息',
      limits: {
        sysRoleIdPicker: {
          label: '管理员角色筛选',
        },
        sysUserInfoModal: {
          label: '管理员信息弹窗',
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
