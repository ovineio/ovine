/**
 * 全局 config 配置
 * 如果配置的内容非常多，可考虑 将 env 拆分为对应的文件
 */

type EnvMode = 'localhost' | 'staging' | 'production'

export type Domain = 'api'

type Config = {
  isProd?: boolean
  isLocal?: boolean
  isStaging?: boolean
  isMock?: boolean
  isRelease?: boolean
  debug: string
  envMode: EnvMode
  domains: Types.Map<Domain, string>
}

type EnvConfig = Omit<Config, 'domains' | 'envMode'> & {
  domains: Types.PartialMap<Domain, string>
}

const defaultConfig: Config = {
  isProd: false,
  isLocal: false,
  isMock: false,
  isRelease: false,
  envMode: 'localhost',
  debug: 'dev:*',
  domains: {
    api: 'http://api-rt-admin.com',
  },
}

// 本地开发 环境
const localhost: EnvConfig = {
  isLocal: true,
  debug: '.*',
  domains: {
    api: 'http://test-api-rt-admin.com',
  },
}

// 测试 环境
const staging: EnvConfig = {
  isStaging: true,
  debug: 'app:*',
  domains: {
    api: 'http://test-api-rt-admin.com',
  },
}

// 生产 环境
const production: EnvConfig = {
  isProd: true,
  debug: '',
  domains: {
    api: 'http://test-api-rt-admin.com',
  },
}

const env = { localhost, staging, production }

const envMode = (process.env.API_ENV || 'localhost') as EnvMode

const config = {
  ...defaultConfig,
  ...env[envMode],
  domains: {
    ...defaultConfig.domains,
    ...env[envMode].domains,
  },
  envMode,
  isMock: process.env.MOCK,
}

config.isRelease = !config.isMock && config.isProd

export default config as Config
