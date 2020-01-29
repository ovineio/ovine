/**
 * 配置 文件
 * 如果配置组件增加，可考虑 将 env 拆分为对应的文件
 */

type EnvMode = 'localhost' | 'staging' | 'production'

type UrlMode = 'api' | 'admin'

type EnvConfig = {
  isProd?: boolean
  isLocal?: boolean
  isStaging?: boolean
  isMock?: boolean
  debug: string
  baseUrl: Types.ObjectOf<string>
}

type AppConfig = EnvConfig & {
  mockUrl: string
  envMode: EnvMode
}

type Config = AppConfig & {
  envMode: EnvMode
  baseUrl: { [key in UrlMode]?: string }
}

const defaultConfig: AppConfig = {
  isProd: false,
  isLocal: false,
  isMock: false,
  debug: 'dev:*',
  envMode: 'localhost',
  mockUrl: '',
  baseUrl: {
    api: '',
  },
}

const localhost: EnvConfig = {
  isLocal: true,
  debug: '.*',
  baseUrl: {
    api: '',
  },
}

const staging: EnvConfig = {
  isStaging: true,
  debug: 'app:*',
  baseUrl: {
    api: '',
  },
}

const production: EnvConfig = {
  isProd: true,
  debug: '',
  baseUrl: {
    api: '',
  },
}

const env = { localhost, staging, production }

const envMode = (process.env.ENV || 'localhost') as EnvMode

const config = {
  ...defaultConfig,
  ...env[envMode],
  envMode,
}

export default config as Config
