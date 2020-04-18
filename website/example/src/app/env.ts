export const env = {
  // 默认配置
  default: {
    domains: {
      api: 'https://test-api.com',
    },
  },
  // 本地开发
  localhost: {
    domains: {
      api: 'http://fi2csz.natappfree.cc',
    },
    logger: {
      moduleName: '.*',
    },
  },
  // 测试环境
  staging: {
    domains: {
      api: 'https://test-api.com',
    },
  },
  // 生产环境
  production: {
    domains: {
      api: 'https://prod-api.com',
    },
  },
}
