/**
 * ovine 应用配置。文档：https://ovine.igroupes.com/org/docs/advance/configurations#%E5%BA%94%E7%94%A8%E9%85%8D%E7%BD%AE
 * 路径别名映射:
 * '@core/*': '@ovine/core/lib/*'
 * '～/*': '/src/*'
 */

const config = {
  env: {
    default: {
      disableLimit: true,
      domains: {
        api: 'https://test-api.com',
      },
    },
    // 本地开发
    localhost: {
      domains: {
        api: 'https://dev-api.com',
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
  },
  entry: [
    {
      type: 'preset-route', // 路由组件
      path: '/login',
      pathToComponent: true,
    },
    {
      type: 'private-route', // 私有路由
      path: '/',
      redirect: '/login',
      onAuth: () => {
        return true
      },
      children: {
        type: 'aside-layout',
        header: {
          showDevItem: false,
          brand: {
            // 公司品牌
            logo: '/static/logo.png',
            title: 'Ovine',
            link: {
              title: 'dashboard',
              href: '/',
            },
          },
          items: [
            {
              type: 'item-setting',
              align: 'right',
            },
          ],
        },
        routes: [
          // 应用内路由
          {
            nodePath: '/',
            label: '侧边栏目录',
            children: [
              {
                path: '/',
                label: 'Dashboard',
                nodePath: 'dashboard',
                exact: true,
                pathToComponent: 'dashboard',
                sideVisible: false,
              },
              {
                label: '快速开始',
                icon: 'fa fa-coffee',
                nodePath: 'start',
              },
            ],
          },
        ],
      },
    },
  ],
}

export default config