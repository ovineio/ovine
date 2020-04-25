import { app } from '@core/app'
import { coreStatic } from '@core/constants'

app.create({
  env: {
    // 环境变量
    localhost: {}, // 本地开发
    staging: {}, // 测试环境
    production: {}, // 生产环境
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
            logo: `${coreStatic}/favicon.ico`,
            title: 'RT-ADMIN',
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
})
