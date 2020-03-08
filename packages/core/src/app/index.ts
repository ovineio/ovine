import defaultsDeep from 'lodash/defaultsDeep'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import set from 'lodash/set'

import { AppInstance } from '@rtadmin/core/app/instance'

import { defaultEnvMode } from '@/constants'

import { isSubStr } from '@/utils/tool'

import { AppRequest } from './request'
import { AppTheme } from './theme'
import { AppConfig, EnvConfig } from './types'
import { AppUser } from './user'

const source: any = {}

const initConfig: AppConfig = {
  request: new AppRequest(),
  user: new AppUser(),
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
    login: {
      route: '/login',
      pagePath: '/login',
    },
    notFound: {
      route: '/404',
      pagePath: '/404',
    },
  },
  routes: [],
  layout: {},
  amis: {},
}

function checkAppGetter(key: string) {
  const val = get(source, key)
  switch (key) {
    case 'theme':
      if (!(val instanceof AppTheme)) {
        throw new Error(
          'You should register theme with AppTheme instance.\neg. app.register("theme", new AppTheme())'
        )
      }
      break
    case 'request':
      if (!(val instanceof AppRequest)) {
        throw new Error(
          'You should register request with AppRequest instance.\neg. app.register("request", new AppRequest())'
        )
      }
      break
    case 'user':
      if (!(val instanceof AppUser)) {
        throw new Error(
          'You should register user with AppUser instance.\neg. app.register("user", new AppUser())'
        )
      }
      break
    default:
  }
}

// 自动引入 siteApp 文件夹代码，最多支持两级目录
function initSiteApp() {
  try {
    require('~\\/app\\/[a-z]*.[j|t]sx?$')
    require('~\\/app\\/[a-z]*\\/index.[j|t]sx?$')
  } catch (_) {
    //
  }
}

class App extends Proxy<AppInstance> {
  private isEnvSetUp = false

  private registers: any[] = []

  create(config: Types.DeepPartial<AppConfig>) {
    Object.assign(source, defaultsDeep(config, initConfig))
    if (config.env) {
      this.setEnv(config.env)
    }
    if (config.request) {
      this.setRequest(config.request)
    }
    initSiteApp()
  }

  register<K extends keyof AppInstance, V extends AppInstance[K]>(
    key: K,
    value: (() => V) | V
  ): void {
    if (key.indexOf('.') > -1) {
      throw new Error(
        `Can not register nest key. You should register the key in this list:\n [${Object.keys(
          initConfig
        )}]`
      )
    }

    // 回调 取值，确保 app.env 已经被设置
    const getValue = () => (isFunction(value) ? value() : value)

    if (key === 'env') {
      this.setEnv(getValue())
      return
    }

    const setValue = () => {
      switch (key) {
        case 'request':
          this.setRequest(getValue())
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

  private dispatchRegisters() {
    this.registers.forEach((register) => register())
    this.registers = []
  }

  private setEnv(value: Types.DeepPartial<EnvConfig>) {
    if (this.isEnvSetUp) {
      throw new Error('App env already set up. Can not reset.')
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

  private setRequest(request: AppRequest) {
    const initEnv = initConfig.env.default

    // 设置request环境变量
    request.setConfig({
      isRelease: get(source, 'env.isRelease') || initEnv.domains.isRelease,
      domains: get(source, 'env.domains') || initEnv.domains,
    })

    set(source, 'request', request.request.bind(request))
  }
}

const app = new App({} as any, {
  get(_, key: string) {
    checkAppGetter(key)
    return get(source, key) || get(initConfig, key)
  },
  set() {
    throw new Error('Can not change app instance, Use `app.register` to register app.')
  },
})

export { app, AppRequest, AppTheme, AppUser }
