import { css, DefaultTheme } from 'styled-components'

import { mockSource as userMock } from '~/pages/login/mock'

import { logout } from '../user'

const apis = {
  info: {
    url: 'GET rtapi/user/info',
    mock: false,
    mockSource: userMock,
  },
  update: {
    url: 'PUT rtapi/user/info',
    mock: false,
    mockSource: userMock,
  },
  password: {
    url: 'PUT rtapi/user/password',
    mock: false,
    mockSource: userMock,
  },
}

export const itemUserSchema = {
  type: 'lib-css',
  css: (theme: DefaultTheme) => css`
    .${theme.ns}Spinner {
      width: 25px !important;
      height: 25px !important;
    }
  `,
  align: 'right',
  body: {
    type: 'service',
    name: 'headItemUserInfo',
    api: apis.info,
    body: {
      type: 'lib-dropdown',
      className: 'clickable',
      body: {
        type: 'html',
        html: `
        <img
          className="w-2x m-r-xs"
          src="$avatar"
          alt="avatar"
          style="width: 28px; height: 28px;"
        />
        <span style="display:inline-block;vertical-align: middle;">$nickname</span>
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
              api: apis.update,
              messages: {
                fetchSuccess: '个人信息修改成功',
              },
              reload: 'headItemUserInfo',
              controls: [
                {
                  type: 'image',
                  label: '头像',
                  autoUpload: false,
                  name: 'avatar',
                  reciever: 'rtapi/file/upload',
                  crop: {
                    aspectRatio: 1,
                  },
                },
                {
                  type: 'static',
                  name: 'nickname',
                  label: '昵称',
                  value: '文本',
                  quickEdit: true,
                },
                {
                  type: 'static',
                  name: 'signature',
                  label: '个性签名',
                  quickEdit: true,
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
              api: apis.password,
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
          onClick: () =>
            logout({
              useApi: true,
            }),
        },
      ],
    },
  },
}
