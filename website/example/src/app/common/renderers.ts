import { addLibRenderer } from '@core/components/amis/lib_renderer'
import { checkLimitByNodePath } from '@core/routes/limit/exports'

import { apis } from './apis'
import { limits } from './limits'

export const definitions = {
  sysRoleIdPicker: {
    type: 'select',
    name: 'roleIds',
    clearable: true,
    multiple: true,
    searchable: true,
    label: '角色名',
    placeholder: '请选择角色',
    searchPromptText: '输入角色ID/角色名',
    autoComplete: apis.sysRoleId,
  },
}

addLibRenderer('sysUserInfoModal', ({ data = {} }) => {
  const { id } = data
  if (!/^\d*$/.test(id)) {
    return '--'
  }

  const isAuth = checkLimitByNodePath(limits.global.sysUserInfoModal)

  if (!isAuth) {
    return id
  }

  return {
    type: 'action',
    level: 'link',
    className: 'no-shadow',
    label: `${id}`,
    actionType: 'dialog',
    dialog: {
      title: '系统用户信息',
      actions: [],
      closeOnEsc: true,
      body: {
        type: 'service',
        api: apis.sysUserInfo,
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
              name: 'signature',
              label: '个性签名',
            },
            {
              type: 'static',
              name: 'remark',
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
