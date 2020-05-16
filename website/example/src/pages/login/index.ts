import { publish } from '@core/utils/message'
import { setStore, clearStore } from '@core/utils/store'

import { storeKeys, msgKeys } from '~/app/constants'
import { userMock } from '~/app/user/mock'

import authCode from './code'
import loginCss from './styled'

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
          <img src="/static/images/logo_grey.png" />
            <p>Ovine 管理后台系统</p>
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
        mockSource: userMock,
        onError: () => {
          publish(msgKeys.updateAuthLoginCode, '')
        },
        onSuccess: (source) => {
          const { code, msg, data } = source
          publish(msgKeys.updateAuthLoginCode, '')
          if (code === 0) {
            setStore(storeKeys.auth, data)
            source.msg = '您已登录登录本系统'
          } else {
            clearStore(storeKeys.auth)
            source.msg = msg || '登录异常'
          }
          return source
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
                type: 'wrapper',
                labelClassName: 'w-auto',
                mode: 'inline',
                component: authCode,
              },
            ],
          },
          [
            {
              type: 'checkbox',
              name: 'remember',
              label: '记住登录',
              value: true,
            },
            {
              type: 'button',
              level: 'link',
              actionType: 'link',
              link: '/register',
              inputClassName: 'no-shadow',
              label: '注册体验账号',
            },
          ],
          {
            type: 'submit',
            level: 'primary',
            label: '登录3',
            inputClassName: 'w-lg',
          },
        ],
      },
    },
  },
}
