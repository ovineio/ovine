/**
 * App 路由
 */

import { RouteItem } from '../route'

const appRoute: RouteItem = {
  label: 'RT-ADMIN 实际应用',
  children: [
    {
      label: '热配置管理',
      icon: 'glyphicon glyphicon-th',
      path: 'hot_config',
      pathToComponent: true,
    },
    {
      label: '博客管理',
      icon: 'glyphicon glyphicon-th',
      children: [
        {
          label: '文章管理',
          path: 'blog/article',
          pathToComponent: true,
        },
        {
          label: '评论管理',
          path: 'blog/comment',
          pathToComponent: true,
        },
      ],
    },
    {
      label: '系统管理',
      icon: 'glyphicon glyphicon-th',
      children: [
        {
          label: '管理员用户',
          path: 'system/user_list',
          pathToComponent: true,
        },
        {
          label: '管理员权限',
          path: 'system/user_role',
          pathToComponent: true,
        },
        {
          label: '系统操作日志',
          path: 'system/user_log',
          pathToComponent: true,
        },
      ],
    },
  ],
}

export default appRoute
