/* eslint-disable max-classes-per-file */
import { createBrowserHistory } from 'history'
import { defaultsDeep, get, isFunction, set } from 'lodash'

import { AppInstance } from '@core/app/instance/type'

import { defaultEnvMode, rootPath, storage } from '@/constants'
import { Request } from '@/utils/request'
import { setGlobal } from '@/utils/store'
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
    // TODO 兼容动态 pathPrefix
    pathPrefix: process.env.PATH_PREFIX || rootPath,
    toastDuration: 1200,
    rootLimitFlag: '*',
    enableBackTop: false,
    notFound: {
      route: '/404',
      pagePath: '',
    },
  },
  entry: [
    {
      type: 'route',
      path: rootPath,
    },
  ],
  amis: {
    affixOffsetTop: 50,
  },
  // 异步数据容器
  asyncPage: {
    schema: {}, // {path: {schema}} // 页面schema
    preset: {}, // {path: preset} // 页面预设
    mock: {}, // {path: mockSource} // 页面mock来源
  },
  hook: {},
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

  private pathPrefix: string = rootPath

  public async create(appConfig: any) {
    const prevBaseUrl = get(source, 'constants.pathPrefix') || rootPath
    // 等待 beforeCreate hook执行完成
    if (appConfig.hook?.beforeCreate) {
      await appConfig.hook.beforeCreate.bind(this, this, appConfig)()
    }
    // 合并参数
    Object.assign(source, defaultsDeep(appConfig, initConfig))
    this.pathPrefix = this.getBaseUrl(appConfig.constants?.pathPrefix)
    set(source, 'constants.pathPrefix', this.pathPrefix)

    if (this.checkBaseUrl(prevBaseUrl, this.pathPrefix)) {
      this.createRouterHistory()
    }

    if (source.env) {
      this.setEnv(source.env)
    }
    if (source.request) {
      this.setRequest(source.request)
    }

    // 等待 afterCreated hook执行完成
    if (source.hook?.afterCreated) {
      await source.hook.afterCreated.bind(this, this, source)()
    }
  }

  public createRouterHistory() {
    this.routerHistory = createBrowserHistory(
      this.pathPrefix === rootPath
        ? undefined
        : {
            basename: this.pathPrefix.slice(0, -1),
          }
    )
  }

  private getBaseUrl(urlGen: any) {
    if (isFunction(urlGen)) {
      return urlGen() || rootPath
    }
    return typeof urlGen === 'string' ? urlGen : rootPath
  }

  private checkBaseUrl(prevBaseUrl: string, pathPrefix: string) {
    if (
      typeof pathPrefix !== 'string' ||
      pathPrefix.substr(-1) !== rootPath ||
      pathPrefix[0] !== rootPath
    ) {
      throw new Error(
        `pathPrefix: "${pathPrefix}" is not allowed. The "pathPrefix" must be string startWith "/" and endWith "/". eg: "/subPath/"`
      )
    }

    if (this.routerHistory && pathPrefix !== prevBaseUrl) {
      window.location.href = pathPrefix
    }

    return !this.routerHistory
  }

  private setEnv(value: Types.DeepPartial<EnvConfig>) {
    const mode = process.env.ENV || defaultEnvMode

    const isMock = process.env.MOCK
    const isRelease = process.env.NODE_ENV === 'production' && get(value, `${mode}.isProd`)

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
    const env = source.env || initEnv
    requestIns.setConfig({
      isMock: env.isMock && !env.isRelease,
      domains: env.domains,
    })

    const requestHandle: any = requestIns.request.bind(requestIns)
    requestHandle.getUrlByOption = requestIns.getUrlByOption.bind(requestIns)

    set(source, 'request', requestHandle)
  }
}

export type AppInsType = AppInstance & AppMountedProps & Omit<AppDefInstance, keyof AppInstance>

export const app: AppInsType = new App() as any
setGlobal(storage.appInstance, app)
