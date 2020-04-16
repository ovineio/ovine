import { layout } from './layout'
import { onAuth } from './user'

export const entry = [
  {
    type: 'preset-route', // 路由组件
    path: '/login',
    pathToComponent: true,
  },
  {
    type: 'private-route', // 私有路由
    path: '/',
    redirect: '/login',
    children: layout,
    onAuth,
  },
]
