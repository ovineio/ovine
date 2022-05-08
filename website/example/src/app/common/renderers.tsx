/**
 * 一些自定义扩展
 */
import { get } from 'lodash'

import React from 'react'

import { addLibRenderer } from '@core/components/amis/lib_renderer'
import { checkLimitByNodePath } from '@core/routes/limit/exports'

import ScrollBar from '~/components/scroll_bar'

import { limitKeys } from '../constants'
import { apis } from './apis'
import './custom_renderer'

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
          body: [
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
              type: 'static',
              name: 'nickname',
              label: '名称',
              tpl: '<span>${nickname} (${id})</span>',
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

// 用于本地数据动态渲染 组件
addLibRenderer('sysSchemaService', (props) => {
  const { data, source: dataKey, updateDeps = [], onSuccess, ...reset } = props
  const source = dataKey ? get(data, dataKey) : data
  const dataSource = onSuccess && source ? onSuccess(source, data, reset) : source

  if (!dataSource) {
    return null
  }

  return {
    type: 'lib-css',
    // 防止显示多余的 loading
    css: ({ ns }) => `
      .schema-service {
        .${ns}Spinner {
          display: none;
        }
      }
    `,
    body: {
      ...reset,
      data,
      type: 'service',
      className: 'schema-service',
      schemaApi: {
        url: `fakeSysSchemaServiceApi?${updateDeps.map((i) => `${i}=$${i}`).join(',')}`,
        onFakeRequest: () => {
          const apiSource = {
            data: dataSource,
          }
          return apiSource
        },
      },
    },
  }
})

addLibRenderer('sysScrollBar', (props) => {
  const {
    render,
    hor = false,
    ver = true,
    height,
    body,
    className = '',
    scrollBarOpts = {},
  } = props

  const heighStyle = height ? `height: ${height}` : ''

  return {
    type: 'lib-css',
    className: `scrollbar-wrap ${className}`,
    css: `
      ${heighStyle}
    `,
    body: {
      component: () => {
        return (
          <ScrollBar hor={hor} ver={ver} options={scrollBarOpts}>
            {render('body', body)}
          </ScrollBar>
        )
      },
    },
  }
})
