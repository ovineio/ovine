/**
 * App 路由
 */

import { RouteItem } from '../types'

const appRoute: RouteItem = {
  label: 'RT-ADMIN 实际应用',
  nodePath: '/',
  children: [
    {
      label: 'Dashboard',
      nodePath: 'dashboard',
      path: '/',
      exact: true,
      pathToComponent: 'dashboard',
      sideVisible: false,
    },
    // {
    //   label: '测试权限设置',
    //   nodePath: 'test_limit',
    //   sideVisible: false,
    //   limitOnly: true,
    // },
    {
      label: '热配置管理',
      icon: 'fa fa-cogs',
      nodePath: 'hot_config',
    },
    {
      label: '博客管理',
      icon: 'fa fa-newspaper-o',
      nodePath: 'blog',
      children: [
        {
          label: '文章管理',
          nodePath: 'article',
        },
        {
          label: '评论管理',
          nodePath: 'comment',
        },
      ],
    },
    {
      label: '系统管理',
      icon: 'fa fa-wrench',
      nodePath: 'system',
      children: [
        {
          label: '管理员用户',
          nodePath: 'user_list',
        },
        {
          label: '管理员权限',
          nodePath: 'user_limit',
          pathToComponent: 'system/user_limit',
        },
        {
          label: '系统操作日志',
          nodePath: 'user_log',
        },
      ],
    },
  ],
}

export default appRoute
