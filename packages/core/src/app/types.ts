import { LoggerConfig } from '@/utils/logger'

import { AppRequest } from './request'
import { AppTheme } from './theme'

type Env = {
  mode: string
  domains: Types.Map<string, string>
  isRelease?: boolean
  isProd?: boolean
  logger?: LoggerConfig
}

export type EnvConfig = {
  default: Env
  [env: string]: Types.DeepPartial<Env>
}

export interface AppConfig {
  request: any
  theme: any
  env: EnvConfig
  entry: any[]
  amis: any
  constants: {
    baseUrl: string
    notFound: {
      route: string
      pagePath: string
    }
  }
}

export interface AppDefInstance extends Omit<AppConfig, 'env'> {
  env: Env & {
    isMock: boolean
  }
  entry: any[]
  request: Types.ClassMethod<AppRequest, 'request'>
  theme: AppTheme
}

declare module '@rtadmin/core/app/instance' {
  export interface AppInstance extends AppDefInstance {}
}
