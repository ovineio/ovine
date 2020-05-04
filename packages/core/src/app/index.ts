/* eslint-disable max-classes-per-file */
import './includes'
import { uuid } from 'amis/lib/utils/helper'
import { defaultsDeep, get, set } from 'lodash'

import { AppInstance } from '@ovine/core/lib/app/instance'

import { defaultEnvMode, message } from '@/constants'
import { publish } from '@/utils/message'
import { isSubStr } from '@/utils/tool'
import * as Types from '@/utils/types'

import { AppRequest } from './request'
import { AppTheme } from './theme'
import { AppConfig, EnvConfig, AppDefInstance } from './types'

const source: any = {}

const { hot } = module as any

// TODO: 如果已经登录后，再次进入 /login 页面，不会做任何处理
const initConfig: AppConfig = {
  request: new AppRequest(),
  theme: new AppTheme(),
  styled: {
    globalStyle: '',
  },
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
      pagePath: '',
    },
  },
  entry: [
    {
      type: 'route',
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

  public create(config: Types.DeepPartial<AppConfig>) {
    Object.assign(source, defaultsDeep(config, initConfig))

    const { env, request, entry, constants } = source
    const { baseUrl } = constants || {}
    if (typeof baseUrl !== 'string' || baseUrl.substr(-1) !== '/') {
      throw new Error(
        `publicPath: "${baseUrl}" is not allowed. The "baseUrl" must be string endWith "/". eg: "/subPath/"`
      )
    }

    if (env) {
      this.setEnv(env)
    }
    if (request) {
      this.setRequest(request)
    }
    if (entry) {
      this.setEntry(entry)
    }
  }

  private setEntry(entry: any[]) {
    if (this.isEntrySetUp) {
      if (!hot) {
        throw new Error('App "entry" already set up. Can not reset.')
      }
      set(source, 'entry', entry)
      publish(message.dev.hot, uuid())
      return
    }
    set(source, 'entry', entry)
    this.isEntrySetUp = true
    import(
      `./app${''}` // fix: ts build will remove comments
      /* webpackMode: "eager" */
      /* webpackChunkName: "app_entry" */
    ).then(({ initApp }) => {
      initApp(source.env)
    })
  }

  private setEnv(value: Types.DeepPartial<EnvConfig>) {
    if (!hot && this.isEnvSetUp) {
      throw new Error('App "env" already set up. Can not reset.')
    }
    const mode = process.env.ENV || defaultEnvMode
    const isMock = process.env.MOCK
    const isRelease =
      !isMock && process.env.NODE_ENV === 'production' && get(value, `${mode}.isProd`)

    const env = defaultsDeep(
      {
        isMock,
        mode,
      },
      value[mode],
      {
        isRelease,
      },
      value.default,
      initConfig.env.default
    )

    set(source, 'env', env)
    this.isEnvSetUp = true
  }

  private setRequest(requestIns: AppRequest) {
    const initEnv = initConfig.env.default
    checkAppGetter('requestFunc', requestIns)
    // 设置request环境变量
    requestIns.setConfig({
      isRelease: get(source, 'env.isRelease') || initEnv.isRelease,
      domains: get(source, 'env.domains') || initEnv.domains,
    })
    const insRequest = requestIns.request.bind(requestIns)
    set(source, 'request', insRequest)
  }
}

const app: AppInstance & Omit<AppDefInstance, keyof AppInstance> & App = new App() as any

export { app, AppRequest, AppTheme }
