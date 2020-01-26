/**
 * 应用环境配置
 */
type EnvConfig = {
  isProd: boolean
  isLocal: boolean
  isMock: boolean
  debug: string
  envMode: string
  baseUrl: Types.ObjectOf<string>
}

export type AppConfig = EnvConfig & {
  mockUrl: string
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

const configs: Types.ObjectOf<AppConfig> = {
  localhost: defaultConfig,
}

export function presetEnvConfig<T extends string, K extends Partial<AppConfig>>(
  mode: T,
  conf: K
): void {
  const fullConfig: AppConfig = { ...defaultConfig, ...conf }
  if (conf.baseUrl) {
    fullConfig.baseUrl = conf.baseUrl
    fullConfig.envMode = mode
  }
  configs[mode] = fullConfig
}

export function getConfig<T extends string>(mode: T) {
  return configs[mode] as Required<AppConfig>
}
