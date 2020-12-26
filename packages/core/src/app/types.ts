import { RenderOptions } from 'amis/lib/factory'
import { History } from 'history'
import { DefaultTheme } from 'styled-components'

import { LoggerConfig } from '@/utils/logger'
import { Request } from '@/utils/request'
import { ReqOption } from '@/utils/request/types'
import { ClassMethod, DeepPartial, Map, ObjectOf } from '@/utils/types'

import { AppTheme } from './theme'

// 重新整理 ENV 环境变量
type Env = {
  mode: string
  domains: Map<string, string>
  disableLimit?: boolean
  isRelease?: boolean
  isProd?: boolean
  logger?: LoggerConfig
}

export type EnvConfig = {
  [env: string]: DeepPartial<Env>
}

export type AppAmis = Partial<
  RenderOptions & {
    constants: ObjectOf<string | number>
    locale: 'zh-cn' | 'en'
    definitions: any
  }
>

type AppConstants = {
  routePrefix: string | (() => string)
  rootLimitFlag: string
  notFound: {
    route: string
    pagePath: string
  }
  toastDuration?: number
  loginRoute?: string
  enableBackTop?: boolean
}

export interface AppConfig {
  request: any
  theme: any
  env: EnvConfig
  amis: AppAmis
  styled: {
    globalStyle: string | ((theme: DefaultTheme) => any)
  }
  constants: AppConstants
  entry: any[]
  hook: {
    beforeCreate?: (app: AppDefInstance, config: AppConfig) => Promise<void>
    afterCreated?: (app: AppDefInstance, config: AppConfig) => Promise<void>
    onAppMounted?: () => void
  }
  // 异步数据容器
  asyncPage: {
    schema: any // {path: {schema}} // 页面schema
    preset: any // {path: preset} // 页面预设
    mock: any // {path: mockSource} // 页面mock来源
  }
}
export interface AppDefInstance extends Omit<AppConfig, 'env' | 'constants'> {
  create: (config: AppConfig) => Promise<void>
  entry: any[]
  theme: AppTheme
  env: Env & {
    isMock: boolean
  }
  constants: Omit<AppConstants, 'routePrefix'> & {
    routePrefix: string
  }
  request: ClassMethod<Request, 'request'> & {
    getUrlByOption: (
      option: ReqOption
    ) => {
      url: string
      method: string
    }
  }
}

export type AppMountedProps = {
  routerHistory: History<any>
}
