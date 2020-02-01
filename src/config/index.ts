/**
 * 全局 config 配置
 * 如果配置的内容非常多，可考虑 将 env 拆分为对应的文件
 */

type EnvMode = 'localhost' | 'staging' | 'production'

export type UrlMode = 'api' | 'admin' | 'mock'

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
    api: 'http://api-rt-admin.com',
  },
}

// 本地开发 环境
const localhost: EnvConfig = {
  isLocal: true,
  debug: '.*',
  urlMode: {
    api: 'http://test-api-rt-admin.com',
  },
}

// 测试 环境
const staging: EnvConfig = {
  isStaging: true,
  debug: 'app:*',
  urlMode: {
    api: 'http://test-api-rt-admin.com',
  },
}

// 生产 环境
const production: EnvConfig = {
  isProd: true,
  debug: '',
  urlMode: {
    api: 'http://test-api-rt-admin.com',
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
