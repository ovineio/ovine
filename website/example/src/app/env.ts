export const env = {
  // 默认配置
  default: {
    disableLimit: false,
    domains: {
      api: 'https://ovine.igroupes.com',
    },
  },
  // 本地开发
  localhost: {
    disableLimit: false,
    domains: {
      // api: 'http://zxq.natapp1.cc',
    },
    logger: {
      moduleName: '.*',
    },
  },
  // 测试环境
  staging: {
    domains: {
      api: 'https://ovine.igroupes.com',
    },
  },
  // 生产环境
  production: {
    domains: {
      api: 'https://ovine.igroupes.com',
    },
  },
}
