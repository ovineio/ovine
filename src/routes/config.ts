export type RouteConfig = {
  icon?: string
  title: string
  path: string
  component?: any
  componentPath?: string
  exact?: boolean
  routes?: RouteConfig[]
}

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    title: 'home',
    icon: '',
    componentPath: 'home',
    exact: true,
  },
  {
    path: '/xxx',
    icon: '',
    title: 'demo测试页面',
    componentPath: 'demo',
    exact: true,
  },
  {
    path: '/yyy',
    icon: '',
    title: 'yyy',
    routes: [
      {
        path: '/xxx',
        icon: '',
        title: 'xxx',
        componentPath: 'demo',
      },
    ],
  },
]

export default routesConfig
