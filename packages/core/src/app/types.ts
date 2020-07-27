import { RenderOptions } from 'amis/lib/factory'
import { History } from 'history'
import { DefaultTheme } from 'styled-components'

import { LoggerConfig } from '@/utils/logger'
import { Request } from '@/utils/request'
import { ReqOption } from '@/utils/request/types'
import { ClassMethod, DeepPartial, Map } from '@/utils/types'

import { AppTheme } from './theme'

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

export type AppAmis = RenderOptions & {
  definitions?: any
}

export interface AppConfig {
  request: any
  theme: any
  env: EnvConfig
  amis: AppAmis
  styled: {
    globalStyle: string | ((theme: DefaultTheme) => any)
  }
  constants: {
    baseUrl: string
    rootLimitFlag: string
    notFound: {
      route: string
      pagePath: string
    }
    toastDuration?: number
    loginRoute?: string
  }
  entry: any[]
  hook: any // 支持 beforeCreate 和 afterCreated hook  TODO 完善hook函数的定义
  pagePreset: any // {path: preset} // 页面预设
  pageMockSource: any // {path: mockSource} // 页面mock来源
  pageSchema: any // {path: {schema}} // 页面schema
}
export interface AppDefInstance extends Omit<AppConfig, 'env'> {
  env: Env & {
    isMock: boolean
  }
  entry: any[]
  request: ClassMethod<Request, 'request'> & {
    getUrlByOption: (
      option: ReqOption
    ) => {
      url: string
      method: string
    }
  }
  theme: AppTheme
}

export type AppMountedProps = {
  routerHistory: History<History.PoorMansUnknown>
}
