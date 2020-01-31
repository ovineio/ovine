/**
 * 配置 文件
 * 如果配置的内容非常多，可考虑 将 env 拆分为对应的文件
 */

type EnvMode = 'localhost' | 'staging' | 'production'

export type UrlMode = 'api' | 'admin'

type EnvConfig = {
  isProd?: boolean
  isLocal?: boolean
  isStaging?: boolean
  isMock?: boolean
  debug: string
  urlMode: Types.ObjectOf<string>
}

type AppConfig = EnvConfig & {
  mockUrl: string
  envMode: EnvMode
}

type Config = AppConfig & {
  envMode: EnvMode
  urlMode: { [key in UrlMode]?: string }
}

const defaultConfig: AppConfig = {
  isProd: false,
  isLocal: false,
  isMock: false,
  debug: 'dev:*',
  envMode: 'localhost',
  mockUrl: '',
  urlMode: {
    api: '',
  },
}

// 本地开发 环境
const localhost: EnvConfig = {
  isLocal: true,
  debug: '.*',
  urlMode: {
    api: '',
  },
}

// 测试 环境
const staging: EnvConfig = {
  isStaging: true,
  debug: 'app:*',
  urlMode: {
    api: '',
  },
}

// 生产 环境
const production: EnvConfig = {
  isProd: true,
  debug: '',
  urlMode: {
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
