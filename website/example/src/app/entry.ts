/**
 * 应用入口
 */

import remoteTestMock from '~/pages/application/hot/mock'
import remoteTestPreset from '~/pages/application/hot/preset'

import { layout } from './layout'
import { onAuth } from './user'

// entry 实际上就是路由配置，必须为数组
export const entry = [
  {
    type: 'preset-route', // 路由组件
    path: '/login',
    pathToComponent: true,
  },
  {
    type: 'preset-route', // 路由组件
    path: '/register',
    pathToComponent: true,
  },
  {
    type: 'preset-route', // 路由组件
    path: '/craft',
    pathToComponent: true,
  },
  {
    type: 'private-route', // 鉴权路由
    path: '/',
    redirect: '/login',
    onAuth, // 每次页面鉴权 需要调用的认证方法
    children: {
      type: 'switch-route',
      children: [
        {
          type: 'preset-route',
          path: '/editor',
          pathToComponent: true,
          exact: true,
        },
        layout,
      ],
    },
  },
]

// app 回调方法
export const hook = {
  // 也可以是 async 异步读取接口
  beforeCreate: (app) => {
    // 重写 app 的一些配置
    app.asyncPage = {
      preset: {
        '/test/remote_schema': remoteTestPreset,
      },
      mock: {
        '/test/remote_schema': remoteTestMock,
      },
    }
  },
  onAppMounted: () => {
    // 当 App 首次被渲染时的回调
  },
}
