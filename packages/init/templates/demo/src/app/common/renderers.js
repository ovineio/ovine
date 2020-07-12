/**
 * 一些自定义扩展
 */

import { addLibRenderer } from '@core/components/amis/lib_renderer'
import { checkLimitByNodePath } from '@core/routes/limit/exports'

import { limitKeys } from '../constants'
import { apis } from './apis'

export const definitions = {
  sysRoleIdPicker: {
    limits: limitKeys.global.sysRoleIdPicker,
    type: 'select',
    name: 'roleIds',
    clearable: true,
    multiple: true,
    searchable: true,
    label: '角色名',
    placeholder: '请选择角色',
    searchPromptText: '输入角色ID/角色名',
    source: apis.sysRoleId,
  },
}

addLibRenderer('sysUserInfoModal', ({ userIdKey = 'id', data = {} }) => {
  const userId = data[userIdKey]

  if (!/^\d*$/.test(userId)) {
    return '--'
  }

  // 校验是否具有 权限
  const isAuth = checkLimitByNodePath(limitKeys.global.sysUserInfoModal)

  if (!isAuth) {
    return userId
  }

  return {
    type: 'action',
    level: 'link',
    className: 'no-shadow',
    label: `${userId}`,
    actionType: 'dialog',
    dialog: {
      title: '系统用户信息',
      actions: [],
      closeOnEsc: true,
      body: {
        type: 'service',
        api: {
          ...apis.sysUserInfo,
          api: apis.sysUserInfo.url,
          url: apis.sysUserInfo.url.replace('$id', userId),
        },
        body: {
          type: 'form',
          wrapWithPanel: false,
          mode: 'horizontal',
          controls: [
            {
              type: 'static-image',
              label: '头像',
              name: 'avatar',
            },
            {
              type: 'static',
              name: 'username',
              label: '登录账号',
            },
            {
              name: 'nickname',
              label: '名称',
              type: 'html',
              html: '<span>${nickname} (${id})</span>',
            },
            {
              type: 'static',
              name: 'desc',
              label: '备注',
            },
            {
              type: 'static-date',
              name: 'updateTime',
              format: 'YYYY-MM-DD HH:mm:ss',
              label: '创建时间',
            },
          ],
        },
      },
    },
  }
})
