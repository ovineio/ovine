/* eslint-disable camelcase  */

import { toast } from 'amis'
import React, { useEffect, useRef } from 'react'

import { app } from '@core/app'
import { useImmer } from '@core/utils/hooks'
import { clearStore, getStore, setStore } from '@core/utils/store'

import { apis } from '~/app/common/apis'
import { prdPathPrefix, storeKeys } from '~/app/constants'

import loginImg from './login_bg.jpg'
import registerImg from './register_bg.jpg'
import { LoginPage } from './styled'

export default () => {
  const memberAuth: any = getStore(storeKeys.rememberLogin) || {}
  const carouselRef = useRef<any>()
  const [state, setState] = useImmer<any>({
    inputs: {
      ...memberAuth,
      code: 'loginCode',
    },
    errorTip: '',
    regErrTip: '',
  })

  const { inputs, errorTip, regErrTip } = state

  const isLoginType = () => {
    return $('.carousel-item.active').data('type') === 'login'
  }

  const setErrorTip = (tip?: string) => {
    const isLogin = isLoginType()
    setState((d) => {
      if (isLogin) {
        d.errorTip = tip || '登录出错，请稍后再试'
      } else {
        d.regErrTip = tip || '注册出错，请稍后再试'
      }
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
    const isLogin = isLoginType()
    const { username, r_username, password, r_password, r_verify, remember } = inputs

    if (isLogin) {
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
    } else {
      if (!r_username) {
        $('input[name="r_username"]').focus()
        setErrorTip('请输入账号')
        return
      }
      if (!r_password) {
        $('input[name="r_password"]').focus()
        setErrorTip('请输入密码')
        return
      }
      if (!r_verify) {
        $('input[name="r_verify"]').focus()
        setErrorTip('请输入重复密码')
        return
      }
      if (r_password !== r_verify) {
        $('input[name="r_verify"]').focus()
        setErrorTip('两次密码输入不一致')
        return
      }
    }

    app
      .request(
        isLogin
          ? {
              ...apis.selfLogin,
              data: inputs,
            }
          : {
              ...apis.selfRegister,
              data: {
                username: r_username,
                password: r_password,
              },
            }
      )
      .then((res) => {
        const { code, msg, data } = res.data

        if (code) {
          clearStore(storeKeys.auth)
          setErrorTip(msg)
          return
        }

        toast.info('欢迎登录本系统～', '系统提示')

        if (isLogin && remember) {
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

  useEffect(() => {
    carouselRef.current = $('#carouse').carousel({
      interval: false,
      keyboard: false,
    })
  }, [])

  const renderBrand = () => {
    return (
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
    )
  }

  return (
    <LoginPage>
      <div id="carouse" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active" data-type="login">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <img alt="LOGIN" src={loginImg} className="img-fluid" />
                </div>
                <div className="col-md-6  m-t-lg">
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      {renderBrand()}
                      <form action="#" method="post">
                        <div
                          className={`form-group first mb-4 ${
                            inputs.username ? 'field--not-empty' : ''
                          }`}
                        >
                          <label htmlFor="username">
                            <i className="iconfont icon-zhanghuxinxi m-r-sm" />
                            <span>账号</span>
                          </label>
                          <input
                            type="text"
                            name="username"
                            className="form-control "
                            value={inputs.username}
                            onChange={onChange}
                          />
                        </div>
                        <div
                          className={`form-group last mb-5 ${
                            inputs.password ? 'field--not-empty' : ''
                          }`}
                        >
                          <label htmlFor="password">
                            <i className="iconfont icon-bss-in-protection m-r-sm" />
                            <span>密码</span>
                          </label>
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
                          {/* <span className="ml-auto">
                      <a href="#" className="forgot-pass">
                        忘记密码
                      </a>
                    </span> */}
                        </div>
                        <button
                          type="button"
                          onClick={onSubmit}
                          className="btn text-white btn-block btn-primary"
                        >
                          <span>登 录</span>
                        </button>
                        <div className="p-t-md">
                          <a
                            className="cursor-pointer"
                            onClick={() => carouselRef.current.carousel('next')}
                          >
                            创建一个新账号
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item" data-type="register">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <h1 className="m-t-none p-b-lg">创建一个账号</h1>
                      <form action="#" method="post">
                        <div
                          className={`form-group first mb-4 ${
                            inputs.r_username ? 'field--not-empty' : ''
                          }`}
                        >
                          <label htmlFor="r_username">
                            <i className="iconfont icon-zhanghuxinxi m-r-sm" />
                            <span>账号</span>
                          </label>
                          <input
                            type="text"
                            name="r_username"
                            className="form-control "
                            value={inputs.r_username}
                            onChange={onChange}
                          />
                        </div>
                        <div
                          className={`form-group first mb-4 ${
                            inputs.r_password ? 'field--not-empty' : ''
                          }`}
                        >
                          <label htmlFor="r_password">
                            <i className="iconfont icon-change-password m-r-sm" />
                            <span>密码</span>
                          </label>
                          <input
                            type="password"
                            name="r_password"
                            className="form-control"
                            value={inputs.r_password}
                            onChange={onChange}
                          />
                        </div>
                        <div
                          className={`form-group last mb-5 ${
                            inputs.r_verify ? 'field--not-empty' : ''
                          }`}
                        >
                          <label htmlFor="r_verify">
                            <i className="iconfont icon-bss-in-protection m-r-sm" />
                            <span>重复密码</span>
                          </label>
                          <input
                            type="password"
                            name="r_verify"
                            className="form-control"
                            value={inputs.r_verify}
                            onChange={onChange}
                          />
                          {regErrTip && <div className="error-tip">{regErrTip}</div>}
                        </div>
                        <button
                          type="button"
                          onClick={onSubmit}
                          className="btn text-white btn-block btn-primary"
                        >
                          <span>注册并登录</span>
                        </button>
                        <div className="p-t-md">
                          <a
                            className="cursor-pointer"
                            onClick={() => carouselRef.current.carousel('prev')}
                          >
                            已有账号直接登录
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  {renderBrand()}
                  <img alt="REGISTER" src={registerImg} className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoginPage>
  )
}
