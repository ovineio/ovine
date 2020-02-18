import { RtSchema } from '~/components/amis/schema/types'
import { logoUrl, testCodeUrl } from '~/constants'
import { userLoginHook } from '~/core/user'

import { mockSource } from './mock'
import { loginCss } from './styled'

export const schema: RtSchema = {
  type: 'page',
  css: loginCss,
  body: {
    type: 'wrapper',
    className: 'login-wrapper b r-2x',
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
        onSuccess: userLoginHook as any,
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
        api: '$preset.apis.login',
        redirect: '/',
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
            value: 'demo',
            description: '体验账户名: demo',
          },
          {
            type: 'password',
            name: 'password',
            label: '密码',
            required: true,
            placeholder: '请输入密码',
            size: 'full',
            value: 'demo',
            description: '体验密码: demo',
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
                value: '5809',
                placeholder: '请输入验证码',
                mode: 'inline',
              },
              {
                type: 'html',
                html: `<img class="code-img" title="测试验证码图片" src="${testCodeUrl}" />`,
                labelClassName: 'w-auto',
                mode: 'inline',
              },
            ],
          },
          {
            type: 'checkbox',
            name: 'remember',
            label: '记住登录',
            value: true,
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
