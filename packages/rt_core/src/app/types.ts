import { AppRequest } from './request'
import { AppTheme } from './theme'
import { AppUser } from './user'

type AppLayout = {
  type?: string // 'asideMenu'
  header?: any
  footer?: any
}

type EnvLogger = {}

type Env = {
  mode: string
  domains: Types.Map<string, string>

  logger?: EnvLogger
}

export type EnvConfig = {
  default: Env
  [env: string]: Types.DeepPartial<Env>
}

export interface AppConfig {
  request: any
  user: any
  theme: any

  env: EnvConfig
  routes: any[]
  layout: AppLayout
  constants: {
    baseUrl: string
    login: {
      route: string
      pagePath: string
    }
    notFound: {
      route: string
      pagePath: string
    }
  }
  amis: any
}

export interface AppDefInstance extends Omit<AppConfig, 'env'> {
  env: Env & {
    isMock: boolean
  }
  request: AppRequest
  user: AppUser
  theme: AppTheme
}
