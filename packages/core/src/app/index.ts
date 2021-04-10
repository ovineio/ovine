/* eslint-disable max-classes-per-file */
import { createBrowserHistory } from 'history'
import { defaultsDeep, get, isFunction, merge, set } from 'lodash'

import { AppInstance } from '@core/app/instance/type'

import { defaultEnvMode, rootRoute, storage } from '@/constants'
import { Request } from '@/utils/request'
import { setGlobal } from '@/utils/store'
import * as Types from '@/utils/types'

import { AppTheme } from './theme'
import { AppConfig, EnvConfig, AppDefInstance, AppMountedProps } from './types'

let source: any = {}

const initConfig: AppConfig = {
  // TODO: 处理某些请夸下的多实例切换，而不是全局唯一实例
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
    routePrefix: rootRoute,
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
      path: rootRoute,
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
// TODO: 允许 APP 多次重复创建
class App extends AppProxy {
  private routerHistory: any

  private routePrefix: string = rootRoute

  public async create(appConfig: any) {
    this.initState()

    const prevBaseUrl = get(source, 'constants.routePrefix') || rootRoute
    // 等待 beforeCreate hook执行完成
    if (appConfig.hook?.beforeCreate) {
      await appConfig.hook.beforeCreate.bind(this, this, appConfig)()
    }

    // 合并参数
    source = merge(initConfig, appConfig)

    this.routePrefix = this.getBaseUrl(appConfig.constants?.routePrefix)
    set(source, 'constants.routePrefix', this.routePrefix)

    if (this.checkBaseUrl(prevBaseUrl, this.routePrefix)) {
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
      this.routePrefix === rootRoute
        ? undefined
        : {
            basename: this.routePrefix.slice(0, -1),
          }
    )
  }

  private initState() {
    // 非 热更新模式下，每次创建，将清除原有数据
    if (!process.env.HOT) {
      source = {}
      this.routePrefix = rootRoute
      this.routerHistory = undefined
    }
  }

  private getBaseUrl(urlGen: any) {
    if (isFunction(urlGen)) {
      return urlGen() || rootRoute
    }
    return typeof urlGen === 'string' ? urlGen : rootRoute
  }

  private checkBaseUrl(prevBaseUrl: string, routePrefix: string) {
    if (
      typeof routePrefix !== 'string' ||
      routePrefix.substr(-1) !== rootRoute ||
      routePrefix[0] !== rootRoute
    ) {
      throw new Error(
        `routePrefix: "${routePrefix}" is not allowed. The "routePrefix" must be string startWith "/" and endWith "/". eg: "/subPath/"`
      )
    }

    if (this.routerHistory && routePrefix !== prevBaseUrl) {
      window.location.href = routePrefix
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
