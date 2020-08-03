/* eslint-disable max-classes-per-file */
import { createBrowserHistory } from 'history'
import { defaultsDeep, get, set } from 'lodash'

import { AppInstance } from '@ovine/core/lib/app/instance/type'

import { defaultEnvMode, storage } from '@/constants'
import { Request } from '@/utils/request'
import { setGlobal } from '@/utils/store'
import { isSubStr } from '@/utils/tool'
import * as Types from '@/utils/types'

import { AppTheme } from './theme'
import { AppConfig, EnvConfig, AppDefInstance, AppMountedProps } from './types'

const source: any = {}

const initConfig: AppConfig = {
  request: new Request(),
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
    toastDuration: 1200,
    rootLimitFlag: '*',
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
  switch (key) {
    case 'theme':
      if (!(value instanceof AppTheme)) {
        throw new Error('You should register theme with AppTheme instance.')
      }
      break
    case 'requestFunc':
      if (!(value instanceof Request)) {
        throw new Error('You should register request with Request instance.')
      }
      break
    default:
  }
}

class AppProxy {
  constructor() {
    const that: any = this
    const proxy = new Proxy<any>(that, {
      get(_, key: string) {
        const value = key in that ? that[key] : get(source, key) || get(initConfig, key)
        return value
      },
    })
    return proxy
  }
}

class App extends AppProxy {
  private routerHistory: any

  public create(appConfig: any) {
    const prevBaseUrl = get(source, 'constants.baseUrl') || initConfig.constants.baseUrl

    Object.assign(source, defaultsDeep(appConfig, initConfig))
    const { env, request, constants } = source
    const { baseUrl } = constants || {}

    if (this.checkBaseUrl(prevBaseUrl, baseUrl)) {
      this.createRouterHistory(baseUrl)
    }

    if (env) {
      this.setEnv(env)
    }
    if (request) {
      this.setRequest(request)
    }
  }

  public createRouterHistory(baseUrl: string) {
    this.routerHistory = createBrowserHistory(
      baseUrl === '/'
        ? undefined
        : {
            basename: baseUrl.slice(0, -1),
          }
    )
  }

  private checkBaseUrl(prevBaseUrl: string, baseUrl: string) {
    if (typeof baseUrl !== 'string' || baseUrl.substr(-1) !== '/' || baseUrl[0] !== '/') {
      throw new Error(
        `baseUrl: "${baseUrl}" is not allowed. The "baseUrl" must be string startWith "/" and endWith "/". eg: "/subPath/"`
      )
    }

    if (this.routerHistory && baseUrl !== prevBaseUrl) {
      window.location.href = baseUrl
    }

    return !this.routerHistory
  }

  private setEnv(value: Types.DeepPartial<EnvConfig>) {
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
  }

  private setRequest(requestIns: Request) {
    const initEnv = initConfig.env.default

    checkAppGetter('requestFunc', requestIns)
    // 设置 request 环境变量

    requestIns.setConfig({
      isRelease: get(source, 'env.isRelease') || initEnv.isRelease,
      domains: get(source, 'env.domains') || initEnv.domains,
    })

    const requestHandle: any = requestIns.request.bind(requestIns)
    requestHandle.getUrlByOption = requestIns.getUrlByOption.bind(requestIns)

    set(source, 'request', requestHandle)
  }
}

export type AppInsType = AppInstance & AppMountedProps & Omit<AppDefInstance, keyof AppInstance>

export const app: AppInsType = new App() as any
setGlobal(storage.appInstance, app)
