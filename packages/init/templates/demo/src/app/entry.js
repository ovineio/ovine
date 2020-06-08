/**
 * 应用入口
 */

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
    type: 'private-route', // 鉴权路由
    path: '/',
    redirect: '/login',
    children: layout,
    onAuth, // 每次页面鉴权 需要调用的认证方法
  },
]
