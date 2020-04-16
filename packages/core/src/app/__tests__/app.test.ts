import { app, AppTheme, AppRequest } from '../index'

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

  test('app.register theme with error value.', () => {
    expect(() => {
      app.register('theme', 'theme')
      app.theme.getAppTheme()
    }).toThrow()
  })

  test('app.register theme.', () => {
    app.register(
      'theme',
      new AppTheme('testTheme', {
        default: {
          testProp: 'green',
        },
        testTheme: {
          testProp: 'red',
        },
      })
    )
    expect(Object.keys(app.theme.getAllThemes()).includes('testTheme')).toBeTruthy()
    expect(app.theme.getTheme().testProp).toBe('red')
  })

  test('app.register request.', async () => {
    const request: any = new AppRequest()
    request.userTokenCtrl = (option: any) => {
      return option
    }
    app.register('request', request)
    const result = await app.request({
      api: 'test/api',
      mockSource: {
        test: 1,
      },
    })
    expect(result.test).toBe(1)
  })
})
