import defaultsDeep from 'lodash/defaultsDeep'
import get from 'lodash/get'
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

function setEnv(value: Types.DeepPartial<EnvConfig>) {
  const mode = process.env.ENV || defaultEnvMode
  set(
    source,
    'env',
    defaultsDeep(
      {
        isMock: process.env.MOCK,
      },
      value[mode],
      value.default,
      initConfig.env
    )
  )
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

class App extends Proxy<AppInstance> {
  create(config: Types.DeepPartial<AppConfig>) {
    Object.assign(source, defaultsDeep(config, initConfig))
    if (config.env) {
      setEnv(config.env)
    }
  }

  register<K extends keyof AppConfig, V extends AppConfig[K]>(key: K, value: V): void {
    if (key.indexOf('.') > -1) {
      throw new Error('Can not register nest key.')
    }
    if (key === 'env') {
      setEnv(value)
      return
    }
    set(source, key, value)
  }
}

export const app = new App({} as any, {
  get(_, key: string) {
    checkAppGetter(key)
    return get(source, key) || get(initConfig, key)
  },
  set() {
    throw new Error('Can not change app instance, Use `app.register` to update.')
  },
})
