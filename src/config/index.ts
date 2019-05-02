/**
 * 应用环境配置
 */
type EnvConfig = {
  isProd: boolean
  isLocal: boolean
  isMock: boolean
  debug: string
  envMode: string
  baseUrl: CustomTypes.ObjectOf<string>
}

type AppConfig = EnvConfig & {
  mockUrl: string
}

const defaultConfig: AppConfig = {
  isProd: false,
  isLocal: true,
  isMock: false,
  debug: 'dev:*',
  envMode: 'localhost',
  mockUrl: '',
  baseUrl: {
    api: '',
  },
}

const configs: CustomTypes.ObjectOf<AppConfig> = {
  localhost: defaultConfig,
}

let envMode = 'localhost'

export function setCurrentEnv(mode: string): void {
  envMode = mode
}

export function presetEnvConfig(mode: string, conf: Partial<AppConfig>): void {
  const fullConfig: AppConfig = { ...defaultConfig, ...conf }
  if (conf.baseUrl) {
    fullConfig.baseUrl = conf.baseUrl
  }
  configs[mode] = fullConfig
}

export const config = configs[envMode] as Required<AppConfig>
