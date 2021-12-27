import { css, DefaultTheme } from 'styled-components'

import { setStore, clearStore } from '@core/utils/store'

import { storeKeys } from '~/app/constants'
import LoginBg from '~/components/login_bg'

export const schema = {
  type: 'page',
  body: [
  {
    type: 'container',
    body: {
      component: LoginBg,
    },
  },{
    type: 'wrapper',
    className: 'register-wrapper b r',
    body: [
      {
        type: 'html',
        html: `
          <h6 class="register-title">
          <img src="/static/images/logo_grey.png" />
            <p>Ovine 注册新账号</p>
          </h6>
        `,
      },
      {
        $preset: 'forms.loginForm',
      },
    ],
  }],
  preset: {
    apis: {
      register: {
        url: 'POST ovapi/user/demo_register',
        onSuccess: (source) => {
          const { code, msg, data } = source
          if (code === 0) {
            setStore(storeKeys.auth, data)
            source.msg = '您已登录登录本系统'
          } else {
            clearStore(storeKeys.auth)
            source.msg = msg || '注册异常'
          }
          return source
        },
      },
    },
    forms: {
      loginForm: {
        type: 'form',
        className: 'register-form',
        title: '',
        mode: 'horizontal',
        horizontal: {
          left: 'col-sm-3',
          right: 'col-sm-8',
        },
        wrapWithPanel: false,
        api: '$preset.apis.register',
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
            type: 'password',
            name: 'confirmPassword',
            label: '确认密码',
            required: true,
            placeholder: '再次输入密码',
            size: 'full',
            validations: {
              equalsField: 'password',
            },
            validationErrors: {
              equalsField: '两次密码输入不一致',
            },
          },
          {
            type: 'button',
            level: 'link',
            actionType: 'link',
            link: '/login',
            inputClassName: 'pull-right no-shadow',
            label: '返回登录',
          },
          {
            type: 'submit',
            size: 'lg',
            level: 'primary',
            label: '注册并登录',
            inputClassName: 'w-full',
            horizontal: {
              left: 'col-sm-2',
              right: 'col-sm-9',
            },
          },
        ],
      },
    },
  },
  css: ({ name }: DefaultTheme) => css`
    .register-wrapper {
      position: relative;
      max-width: 450px;
      margin: 12% auto 0;
      background-color: ${name === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255, 255, 255, 0.9)'};
    }

    .register-title {
      margin: 0 0 15px 0px;
      font-size: 30px;
      text-align: center;

      img {
        display: inline-block;
        width: 50px;
        vertical-align: middle;
      }
      p {
        display: inline-block;
        margin: 0;
        vertical-align: middle;
      }
    }

    .register-form {
      padding-top: 15px;

      .is-error {
        label {
          color: #58666e;
        }
      }
    }

    .cxd-Form-label {
      text-align: right !important;
    }
  `,
}
