import { SchemaNode } from 'amis/lib/types'
import React from 'react'

import { Schema } from '~/amis/schema'
// import { setStorage } from '~/utils/store'

import { StyledLogin } from './styled'

// setStorage('isLogin', 1)

const loginSchema: SchemaNode = {
  type: 'page',
  body: {
    type: 'wrapper',
    className: 'login-wrapper b r-2x bg-white',
    body: [
      {
        type: 'html',
        html: `
          <h6 class="login-title">
            <img src="/static/images/logo.png" title="rt-admin" />
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
                type: 'static-image',
                labelClassName: 'w-auto',
                mode: 'inline',
                value: 'https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg',
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
      <Schema schema={loginSchema} />
    </StyledLogin>
  )
}
