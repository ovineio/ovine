import { toast } from 'amis'
import React from 'react'

import { app } from '@core/app'
import { useImmer } from '@core/utils/hooks'
import { clearStore, getStore, setStore } from '@core/utils/store'

import { apis } from '~/app/common/apis'
import { prdPathPrefix, storeKeys } from '~/app/constants'

import loginImg from './login_bg.jpg'
import { LoginPage } from './styled'

export default () => {
  const memberAuth: any = getStore(storeKeys.rememberLogin) || {}

  const [state, setState] = useImmer<any>({
    inputs: {
      ...memberAuth,
      code: 'loginCode',
    },
    errorTip: '',
  })

  const { inputs, errorTip } = state

  const setErrorTip = (tip?: string) => {
    setState((d) => {
      d.errorTip = tip || '登录出错，请稍后再试'
    })
  }

  const setInput = (name, value) => {
    setState((d) => {
      d.inputs[name] = value
    })
  }

  const onChange = (e) => {
    const { name, value = '', checked } = e.target
    if (name) {
      setInput(name, name === 'remember' ? checked : value)
    }
  }

  const onSubmit = () => {
    const { username, password, remember } = inputs
    if (!username) {
      $('input[name="username"]').focus()
      setErrorTip('请输入账号')
      return
    }
    if (!password) {
      $('input[name="password"]').focus()
      setErrorTip('请输入密码')
      return
    }
    app
      .request({
        ...apis.selfLogin,
        data: inputs,
      })
      .then((res) => {
        const { code, msg, data } = res.data

        if (code) {
          clearStore(storeKeys.auth)
          setErrorTip(msg)
          return
        }

        toast.info('欢迎登录本系统～', '系统提示')
        if (remember) {
          setStore(storeKeys.rememberLogin, inputs)
        } else {
          clearStore(storeKeys.rememberLogin)
        }
        setStore(storeKeys.auth, data)
        app.routerHistory.push(`${prdPathPrefix}/experiment/data_model/mode_list`)
      })
      .catch(() => {
        setErrorTip()
      })
  }

  return (
    <LoginPage>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img alt="LOGIN" src={loginImg} className="img-fluid" />
          </div>
          <div className="col-md-6 contents">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="mb-4 brand">
                  <img
                    className="d-inline-block align-top m-r-md m-t-xs"
                    src="https://ovine.igroupes.com/demo/static/images/logo_line_white.png"
                    alt="LOGO"
                    loading="lazy"
                  />
                  <div>
                    <h3>
                      <strong>Ovine 管理中心</strong>
                    </h3>
                    <p>致力于打造用户最值得信赖的数据管理工具</p>
                  </div>
                </div>
                <form action="#" method="post">
                  <div
                    className={`form-group first mb-4 ${inputs.username ? 'field--not-empty' : ''}`}
                  >
                    <label htmlFor="username">账号</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control "
                      value={inputs.username}
                      onChange={onChange}
                    />
                  </div>
                  <div
                    className={`form-group last mb-5 ${inputs.password ? 'field--not-empty' : ''}`}
                  >
                    <label htmlFor="password">密码</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={inputs.password}
                      onChange={onChange}
                    />
                    {errorTip && <div className="error-tip">{errorTip}</div>}
                  </div>
                  <div className="d-flex mb-5 align-items-center">
                    <label className="control control--checkbox mb-0">
                      <span className="caption">记住密码</span>
                      <input
                        type="checkbox"
                        name="remember"
                        checked={inputs.remember}
                        onChange={onChange}
                      />
                      <div className="iconfont icon-duigou control__indicator" />
                    </label>
                    <span className="ml-auto">
                      <a href="#" className="forgot-pass">
                        忘记密码
                      </a>
                    </span>
                  </div>
                  <input
                    type="button"
                    onClick={onSubmit}
                    value="登 录"
                    className="btn text-white btn-block btn-primary"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoginPage>
  )
}
