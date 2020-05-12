import { app } from '../index'

const testAppConfig = {
  env: {
    default: {
      domains: {
        api: 'https://site.com/api',
      },
    },
    localhost: {},
    staging: {},
    production: {},
  },
  routes: [
    {
      // 路由配置
      path: '/login',
      withOutAuth: true,
      withOutLimit: true,
      layout: false,
    },
    {
      path: '/404',
      withOutLimit: true,
    },
    {
      path: '/dashboard',
    },
  ],
  layout: {},
}

beforeAll(() => {
  app.create(testAppConfig)
})

describe('core app tests.', () => {
  test('app.create', () => {
    expect(app.env.domains.api).toBeDefined()
  })
})
