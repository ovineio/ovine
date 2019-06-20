import { RouteConfig } from '@routes/config'

const mapComponent = (configRoutes: RouteConfig[]): any[] => {
  return configRoutes.map((route: RouteConfig) => {
    const { path, componentPath } = route

    if (componentPath) {
      route.component = `@pages/${componentPath}/index.tsx`
    }
    if (route.routes) {
      if (route.component) {
        return mapComponent(route.routes)
      } else {
        return route.routes.map((item) => {
          item.path = `${path}${item.path}`
          if (item.componentPath) {
            item.component = `@pages/${item.componentPath}/index.tsx`
          }
          return item
        })
      }
    }
    return route
  })
}

// console.dir(mapComponent(routesConfig))
