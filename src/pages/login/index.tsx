import { render as renderAmis } from 'amis'
import { SchemaNode } from 'amis/lib/types'
import React from 'react'

import { StyledLogin } from './styled'

const login: SchemaNode = {
  type: 'page',
  body: {
    type: 'wrapper',
    className: 'login-wrapper',
    body: {
      type: 'form',
      className: 'login-form',
      title: '',
      mode: 'horizontal',
      autoFocus: false,
      redirect: '/123',
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
          name: 'rememberMe',
          label: '记住登录',
        },
        {
          type: 'submit',
          btnClassName: 'btn-default',
          label: '登录',
        },
      ],
    },
  },
}

export default () => {
  return <StyledLogin>{renderAmis(login)}</StyledLogin>
}
