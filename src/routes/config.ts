export type RouteConfig = {
  icon?: string
  title: string
  path: string
  component?: any
  componentPath?: string
  children?: RouteConfig[]
}

export const routesConfig: RouteConfig[] = [
  {
    path: '/',
    title: '首页',
    icon: 'home',
    componentPath: '/home',
  },
  {
    path: '/demo',
    icon: 'home',
    title: '测试页面',
    componentPath: '/demo',
  },
  {
    path: '/grade',
    icon: 'home',
    title: '多级测试',
    children: [
      {
        path: '/grade1',
        title: '二级菜单',
        children: [
          {
            path: '/grade2',
            title: '三级菜单',
            componentPath: '/home',
          },
        ],
      },
    ],
  },
  {
    path: '/system',
    icon: 'home',
    title: '系统管理',
    children: [
      {
        path: '/admin_user',
        icon: '',
        title: '系统用户',
      },
      {
        path: '/limits',
        icon: '',
        title: '权限设置',
      },
    ],
  },
]
