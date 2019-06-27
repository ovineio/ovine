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
            children: [
              {
                path: '/grade3',
                title: '四级菜单',
                componentPath: '/home',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/test1',
    icon: 'home',
    title: '测试',
    componentPath: '/home',
  },
  {
    path: '/test2',
    icon: 'home',
    title: '测试1',
    componentPath: '/home',
  },
  {
    path: '/test3',
    icon: 'home',
    title: '测试2',
    componentPath: '/home',
  },
  {
    path: '/test4',
    icon: 'home',
    title: '测试3',
    componentPath: '/home',
  },
  {
    path: '/test5',
    icon: 'home',
    title: '测试5',
    componentPath: '/home',
  },
  {
    path: '/test6',
    icon: 'home',
    title: '测试6',
    componentPath: '/home',
  },
  {
    path: '/test7',
    icon: 'home',
    title: '测试7',
    componentPath: '/home',
  },
  {
    path: '/test8',
    icon: 'home',
    title: '测试8',
    componentPath: '/home',
  },
  {
    path: '/test9',
    icon: 'home',
    title: '测试8',
    componentPath: '/home',
  },
]
