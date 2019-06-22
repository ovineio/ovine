import logger from '@utils/logger'
import { deepClone, deepTraversal } from '@utils/tool'

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
    title: 'home',
    icon: '',
    componentPath: 'home',
  },
  {
    path: '/xxx',
    icon: '',
    title: 'demo测试页面',
    componentPath: 'demo',
  },
  {
    path: '/yyy',
    icon: '',
    title: 'yyy',
    children: [
      {
        path: '/xxx',
        icon: '',
        title: 'xxx',
        componentPath: 'home',
      },
    ],
  },
]

const parseRoutesConfig = (configRoutes: RouteConfig[], parentPath: string = ''): any[] => {
  return configRoutes.map((route: RouteConfig) => {
    if (route.children) {
      route.children = parseRoutesConfig(route.children, route.path)
    } else {
      route.path = `${parentPath}${route.path}`
    }
    return route
  })
}

export const flatRoutesConfig = deepTraversal(parseRoutesConfig(deepClone(routesConfig)))
logger.getLogger('app:route:config').log({ routesConfig, flatRoutesConfig })
