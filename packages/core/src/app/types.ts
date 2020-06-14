import { RenderOptions } from 'amis/lib/factory'
import { History } from 'history'
import { DefaultTheme } from 'styled-components'

import { LoggerConfig } from '@/utils/logger'
import { Request } from '@/utils/request'
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
