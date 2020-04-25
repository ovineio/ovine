import { RenderOptions } from 'amis/lib/factory'
import { DefaultTheme } from 'styled-components'

import { LoggerConfig } from '@/utils/logger'
import { ClassMethod, DeepPartial, Map } from '@/utils/types'

import { AppRequest } from './request'
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
  entry: any[]
  amis: RenderOptions & {
    definitions?: any
    apiResAdapter?: (res: any) => any
  }
  styled: {
    globalStyle: string | ((theme: DefaultTheme) => any)
  }
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
  request: ClassMethod<AppRequest, 'request'>
  theme: AppTheme
}
