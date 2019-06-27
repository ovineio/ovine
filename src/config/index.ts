import { getConfig, presetEnvConfig, AppConfig } from './env'

export type UrlMode = 'api' | 'admin'

export type EnvMode = 'localhost' | 'test' | 'production'

type Config = AppConfig & {
  envMode: EnvMode
  baseUrl: { [key in UrlMode]?: string }
}

presetEnvConfig<EnvMode, Partial<Config>>('localhost', {
  mockUrl: 'https://easy-mock.com/mock/5ccb7476e632d85da4a24269/api/v1',
  isLocal: true,
  debug: '.*',
})

presetEnvConfig<EnvMode, Partial<Config>>('test', {
  debug: 'app:*',
  baseUrl: {
    api: 'https://test-rt-admin/api',
  },
})

presetEnvConfig<EnvMode, Partial<Config>>('production', {
  isProd: true,
  debug: '',
  baseUrl: {
    api: 'https://rt-admin/api',
  },
})

const config = getConfig<EnvMode>(process.env.API_ENV || 'localhost')

export default config as Config
