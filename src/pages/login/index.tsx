import { logoUrl } from '~/constants'
import { RtSchema } from '~/widgets/amis/schema/types'

import { mockSource } from './mock'
import { loginCss } from './styled'

export const schema: RtSchema = {
  type: 'page',
  css: loginCss,
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
        $preset: 'forms.loginForm',
      },
    ],
  },
  preset: {
    apis: {
      login: {
        url: 'POST api/v1/login',
        mockSource,
      },
    },
    forms: {
      loginForm: {
        type: 'form',
        className: 'login-form',
        title: '',
        mode: 'horizontal',
        wrapWithPanel: false,
        autoFocus: false,
        redirect: '/',
        api: '$preset.apis.login',
        messages: {
          saveSuccess: '欢迎您登录本系统～',
        },
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
    },
  },
}
