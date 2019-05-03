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
    title: 'home',
    componentPath: 'home',
  },
]

export default routesConfig
