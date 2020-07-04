/**
 * 应用环境配置
 *
 * ovine cli命令:  build/dev  --env=xxx 可以使用对应配置
 * dev 默认环境为 localhost, build 默认环境为 production
 */

export const env = {
  // 默认配置,如果对应的环境的变量不设置，就会使用默认的
  default: {
    disableLimit: false,
    domains: {
      api: 'https://ovine.igroupes.com', // ovine api 地址
    },
  },
  // 本地开发
  localhost: {
    disableLimit: false,
    domains: {
      api: 'https://ovine.igroupes.com',
    },
    // 日志配置
    logger: {
      // 可根据需要写正则匹配
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
    isProd: true, // 标示是生产环境
    domains: {
      api: 'https://ovine.igroupes.com',
    },
  },
}
