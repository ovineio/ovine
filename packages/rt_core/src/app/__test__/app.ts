import { app } from '../app'
import { AppDefInstance } from '../types'

declare module '@rtadmin/core/app/instance' {
  export interface AppInstance extends AppDefInstance {}
}

app.create({
  env: {
    default: {},
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
})
