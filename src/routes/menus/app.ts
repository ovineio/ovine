/**
 * App 路由
 */

import { RouteItem } from '../route'

const appRoute: RouteItem = {
  label: 'RT-ADMIN 实际应用',
  children: [
    {
      label: 'Dashboard',
      path: 'dashboard',
      sideVisible: false,
    },

    {
      label: '热配置管理',
      icon: 'fa fa-cogs',
      path: 'hot_config',
    },
    {
      label: '博客管理',
      icon: 'fa fa-newspaper-o',
      children: [
        {
          label: '文章管理',
          path: 'blog/article',
        },
        {
          label: '评论管理',
          path: 'blog/comment',
        },
      ],
    },
    {
      label: '系统管理',
      icon: 'fa fa-wrench',
      children: [
        {
          label: '管理员用户',
          path: 'system/user_list',
        },
        {
          label: '管理员权限',
          path: 'system/user_limit',
        },
        {
          label: '系统操作日志',
          path: 'system/user_log',
        },
      ],
    },
  ],
}

export default appRoute
