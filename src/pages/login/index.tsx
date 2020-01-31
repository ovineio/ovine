import { SchemaNode } from 'amis/lib/types'
import React from 'react'

import { logoUrl } from '~/constants'
import { setStore } from '~/utils/store'
import { Schema } from '~/widgets/amis/schema'

import { StyledLogin } from './styled'

setStore('isLogin', 1)

const schema: SchemaNode = {
  type: 'page',
  body: {
    type: 'wrapper',
    className: 'login-wrapper b r-2x bg-white',
    body: [
      {
        type: 'html',
        html: `
          <h6 class="login-title">
            <img src="${logoUrl}" title="rt-admin" />
            <p>RT-ADMIN 管理后台系统</p>
          </h6>
        `,
      },
      {
        type: 'form',
        className: 'login-form',
        title: '',
        mode: 'horizontal',
        wrapWithPanel: false,
        autoFocus: false,
        redirect: '/123',
        // api: {
        //   url: '/asd/123',
        // },
        controls: [
          {
            type: 'text',
            name: 'username',
            required: true,
            placeholder: '请输入用户名',
            label: '用户名',
            size: 'full',
          },
          {
            type: 'password',
            name: 'password',
            label: '密码',
            required: true,
            placeholder: '请输入密码',
            size: 'full',
          },
          {
            type: 'group',
            label: '验证码',
            required: true,
            gap: 'xs',
            controls: [
              {
                type: 'text',
                name: 'code',
                required: true,
                placeholder: '请输入验证码',
                mode: 'inline',
              },
              {
                type: 'html',
                html: `<img src="https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg" />`,
                labelClassName: 'w-auto',
                mode: 'inline',
              },
            ],
          },
          {
            type: 'checkbox',
            name: 'remember',
            label: '记住登录',
          },
          {
            type: 'submit',
            level: 'primary',
            label: '登录',
            inputClassName: 'w-lg',
          },
        ],
      },
    ],
  },
}

export default () => {
  return (
    <StyledLogin>
      <Schema schema={schema} />
    </StyledLogin>
  )
}
