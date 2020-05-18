import { RenderOptions } from 'amis/lib/factory'
import { History } from 'history'
import { DefaultTheme } from 'styled-components'

import { LoggerConfig } from '@/utils/logger'
import { Request } from '@/utils/request'
import { ClassMethod, DeepPartial, Map, ObjectOf } from '@/utils/types'

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
  default: Env
  [env: string]: DeepPartial<Env>
}

export interface AppConfig {
  request: any
  theme: any
  env: EnvConfig
  amis: RenderOptions & {
    definitions?: any
    apiResAdapter?: (res: any) => any
  }
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
    actionAddrMap?: ObjectOf<string>
  }
  entry: any[]
}

export interface AppDefInstance extends Omit<AppConfig, 'env'> {
  env: Env & {
    isMock: boolean
  }
  entry: any[]
  request: ClassMethod<Request, 'request'>
  theme: AppTheme
}

export type AppMountedProps = {
  routerHistory: History<History.PoorMansUnknown>
}
