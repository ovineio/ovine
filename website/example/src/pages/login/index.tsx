import { coreStatic } from '@core/constants'
import { publish } from '@core/utils/message'
import { setStore, clearStore } from '@core/utils/store'

import { storeKeys, msgKeys } from '~/app/constants'

import Code from './code'
import { mockSource } from './mock'
import { loginCss } from './styled'

export const schema = {
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
          <img src="${`${coreStatic}/favicon.ico`}" />
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
        url: 'POST rtapi/user/login',
        mock: false,
        mockSource,
        onError: () => {
          publish(msgKeys.updateAuthLoginCode, '')
        },
        onSuccess: (source) => {
          const { code, msg, data } = source
          publish(msgKeys.updateAuthLoginCode, '')
          if (code === 0) {
            setStore(storeKeys.auth, data)
          } else {
            clearStore(storeKeys.auth)
            throw Error(msg || '登录异常')
          }
        },
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
            value: 'admin',
            description: '体验账户名: admin',
          },
          {
            type: 'password',
            name: 'password',
            label: '密码',
            required: true,
            placeholder: '请输入密码',
            size: 'full',
            value: 'admin123',
            description: '体验密码: admin123',
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
                type: 'wrapper',
                labelClassName: 'w-auto',
                mode: 'inline',
                component: Code,
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
