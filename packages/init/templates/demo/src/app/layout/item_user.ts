/**
 * 顶部栏，用户头像扩展
 */

import { css, DefaultTheme } from 'styled-components'

import { ellipsis } from '@core/styled/utils'

import { apis } from '../common/apis'
import { logout } from '../user'

export const itemUserSchema = {
  type: 'head-item',
  align: 'right',
  className: 'p-none',
  body: {
    type: 'lib-css',
    align: 'right',
    body: {
      type: 'service',
      name: 'headItemUserInfo',
      api: apis.getSelfInfo,
      body: {
        type: 'lib-dropdown',
        className: 'clickable',
        body: {
          type: 'html',
          className: 'item-user-content',
          html: `
          <img
            className="w-2x m-r-xs"
            src="$avatar"
            alt="avatar"
          />
          <div>$nickname</div>
        `,
        },
        items: [
          {
            type: 'button',
            level: 'link',
            icon: 'fa fa-edit',
            label: '编辑信息',
            actionType: 'dialog',
            dialog: {
              title: '您的个人信息',
              body: {
                type: 'form',
                api: apis.editSelfInfo,
                messages: {
                  fetchSuccess: '个人信息修改成功',
                },
                reload: 'headItemUserInfo',
                controls: [
                  {
                    type: 'image',
                    label: '头像',
                    name: 'avatar',
                    receiver: apis.uploadImg,
                    autoUpload: false,
                    maxLength: 1,
                    maxSize: 1024 * 300,
                    width: 200,
                    height: 200,
                    crop: {
                      aspectRatio: 1,
                    },
                  },
                  {
                    type: 'static',
                    name: 'nickname',
                    label: '名称',
                    value: '文本',
                    quickEdit: true,
                  },
                  {
                    type: 'static',
                    name: 'signature',
                    label: '个性签名',
                    quickEdit: true,
                  },
                  {
                    name: 'parentId',
                    type: 'tpl',
                    label: '创建者',
                    hiddenOn: '!data.parentId',
                    tpl: '<%= data.parentNickname  + " (" + data.parentId + ")" %>',
                  },
                ],
              },
            },
          },
          {
            type: 'button',
            level: 'link',
            icon: 'fa fa-key',
            label: '修改密码',
            actionType: 'dialog',
            dialog: {
              title: '修改登录密码',
              size: 'sm',
              body: {
                type: 'form',
                api: apis.changeSelfPwd,
                messages: {
                  saveSuccess: '[密码修改成功] 请使用新密码重新登录',
                  saveFailed: '密码修改失败',
                },
                redirect: '/login',
                mode: 'horizontal',
                horizontal: {
                  left: 'col-sm-3',
                  right: 'col-sm-9',
                },
                controls: [
                  {
                    type: 'password',
                    required: true,
                    name: 'oldPassword',
                    label: '旧密码',
                  },
                  {
                    type: 'password',
                    name: 'password',
                    required: true,
                    label: '新密码',
                  },
                  {
                    type: 'password',
                    name: 'confirmPassword',
                    required: true,
                    label: '重复密码',
                    validationErrors: {
                      equalsField: '两次密码输入不一致',
                    },
                    validations: {
                      equalsField: 'password',
                    },
                  },
                ],
              },
            },
          },
          {
            type: 'button',
            level: 'link',
            icon: 'fa fa-reply',
            label: '退出登录',
            onClick: () => logout({ useApi: true }),
          },
        ],
      },
    },
    css: (theme: DefaultTheme) => css`
      .${theme.ns}Spinner {
        width: 25px !important;
        height: 25px !important;
      }
      .item-user-content {
        display: inline-block;
        min-width: 80px;
        padding: 2px;
        img {
          width: 28px;
          height: 28px;
        }
        div {
          ${ellipsis('100px')};
          vertical-align: middle;
        }
      }
    `,
  }
}
