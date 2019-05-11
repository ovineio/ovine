import { lazy } from 'react'
import { renderRoutes } from 'react-router-config'
import Layout from '@widgets/layout/main'
import routesConfig, { RouteConfig } from './config'

const routes: any = {
  component: Layout,
}

const mapComponent = (configRoutes: RouteConfig[]): any[] => {
  return configRoutes.map((route: RouteConfig) => {
    const { path, componentPath } = route

    if (componentPath) {
      route.component = lazy(() => import(`@pages/${componentPath}/index.tsx`))
    }
    if (route.routes) {
      if (route.component) {
        return mapComponent(route.routes)
      } else {
        return route.routes.map((item) => {
          item.path = `${path}${item.path}`
          if (item.componentPath) {
            item.component = lazy(() => import(`@pages/${item.componentPath}/index.tsx`))
          }
          return item
        })
      }
    }
    return route
  })
}

routes.routes = mapComponent(routesConfig)

export const appRoutes = [routes]

export default renderRoutes(appRoutes)
