/* eslint-disable max-classes-per-file */
import './includes'

import { defaultsDeep, get, isFunction, set } from 'lodash'

import { AppInstance } from '@rtadmin/core/app/instance'

import { defaultEnvMode } from '@/constants'
import { isSubStr } from '@/utils/tool'

import { AppRequest } from './request'
import { AppTheme } from './theme'
import { AppConfig, EnvConfig } from './types'

const source: any = {}

const initConfig: AppConfig = {
  request: new AppRequest(),
  theme: new AppTheme(),
  env: {
    default: {
      mode: defaultEnvMode,
      domains: {
        api: 'http://site-api.com',
      },
    },
  },
  constants: {
    baseUrl: isSubStr(process.env.PUBLIC_PATH || '', 'http', 0)
      ? '/'
      : process.env.PUBLIC_PATH || '/',
    notFound: {
      route: '/404',
      pagePath: '/404',
    },
  },
  entry: [
    {
      path: '/',
    },
  ],
  amis: {},
}

function checkAppGetter(key: string, value?: any) {
  const val = value || get(source, key)
  switch (key) {
    case 'theme':
      if (!(val instanceof AppTheme)) {
        throw new Error(
          'You should register theme with AppTheme instance.\neg. app.register("theme", new AppTheme())'
        )
      }
      break
    case 'requestFunc':
      if (!(val instanceof AppRequest)) {
        throw new Error(
          'You should register request with AppRequest instance.\neg. app.register("request", new AppRequest())'
        )
      }
      break
    default:
  }
}
class AppProxy {
  constructor() {
    const that: any = this
    const proxy = new Proxy<AppInstance>(that, {
      get(_, key: string) {
        checkAppGetter(key)
        if (key in that) {
          return that[key]
        }
        return get(source, key) || get(initConfig, key)
      },
    })
    return proxy
  }
}
class App extends AppProxy {
  private isEnvSetUp = false

  private isEntrySetUp = false

  private registers: any[] = []

  public create(config: Types.DeepPartial<AppConfig>) {
    Object.assign(source, defaultsDeep(config, initConfig))
    if (config.env) {
      this.setEnv(config.env)
    }
    if (config.entry) {
      this.setEntry(config.entry)
    }
    if (config.request) {
      this.setRequest(config.request)
    }
  }

  public register<K extends keyof AppInstance, V extends AppInstance[K]>(
    key: K,
    value: (() => V) | V
  ): void {
    if ((key as string).indexOf('.') > -1) {
      throw new Error(
        `Can not register nest key. You should register the key in this list:\n [${Object.keys(
          initConfig
        )}]`
      )
    }

    // 回调 取值，确保 app.env 已经被设置
    const getValue = () => (isFunction(value) ? (value as any)() : value)

    if (key === 'env') {
      this.setEnv(getValue())
      return
    }

    const setValue = () => {
      switch (key) {
        case 'request':
          this.setRequest(getValue())
          break
        case 'entry':
          this.setEntry(getValue())
          break
        default:
          set(source, key, getValue())
      }
    }

    if (!this.isEnvSetUp) {
      this.registers.push(setValue)
      return
    }

    setValue()
  }

  private setEntry(entry: any[]) {
    if (this.isEntrySetUp) {
      throw new Error('App "entry" already set up. Can not reset.')
    }
    set(source, 'entry', entry)
    this.isEntrySetUp = true
    import(/* webpackChunkName: "app_entry" */ './app').then(({ initApp }) => {
      initApp()
    })
  }

  private dispatchRegisters() {
    this.registers.forEach((register) => register())
    this.registers = []
  }

  private setEnv(value: Types.DeepPartial<EnvConfig>) {
    if (this.isEnvSetUp) {
      throw new Error('App "env" already set up. Can not reset.')
    }
    const mode = process.env.ENV || defaultEnvMode
    const isMock = process.env.MOCK
    const isRelease =
      !isMock && process.env.NODE_ENV === 'production' && get(value, `${mode}.isProd`)
    const env = defaultsDeep(
      {
        isMock,
      },
      value[mode],
      {
        isRelease,
      },
      value.default,
      initConfig.env
    )
    set(source, 'env', env)
    this.isEnvSetUp = true
    this.dispatchRegisters()
  }

  private setRequest(requestIns: AppRequest) {
    const initEnv = initConfig.env.default
    checkAppGetter('requestFunc', requestIns)

    // 设置request环境变量
    requestIns.setConfig({
      isRelease: get(source, 'env.isRelease') || initEnv.isRelease,
      domains: get(source, 'env.domains') || initEnv.domains,
    })

    set(source, 'request', requestIns.request.bind(requestIns))
  }
}

const app: AppInstance & App = new App() as any

export { app, AppRequest, AppTheme }
