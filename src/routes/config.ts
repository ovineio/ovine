export type RouteConfig = {
  title: string
  path: string
  componentPath: string
  exact?: boolean
  routes?: RouteConfig[]
}

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    title: 'demo',
    componentPath: 'demo',
    // routes: [
    //   {
    //     path: '/demo',
    //     title: 'demo测试页面',
    //     componentPath: 'demo',
    //   },
    // ],
  },
]

export default routesConfig
