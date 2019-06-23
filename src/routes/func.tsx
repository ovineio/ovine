import { lazy } from 'react'

import { RouteConfig } from './config'

export const parseRoutesConfig = (configRoutes: RouteConfig[], parentPath: string = ''): any[] => {
  return configRoutes.map((route: RouteConfig) => {
    const path = `${parentPath}${route.path}`
    if (route.children) {
      route.children = parseRoutesConfig(route.children, path)
    } else {
      route.path = path
    }
    return route
  })
}

export function getHashPageMap(flatRoutesConfig: RouteConfig[]) {
  const pageMap: CustomTypes.ObjectOf<React.LazyExoticComponent<() => JSX.Element>> = {}
  flatRoutesConfig.map((route) => {
    const { path, componentPath } = route
    const comPath = componentPath || path
    pageMap[path] = lazy(() => import(`@pages/${comPath.slice(1)}/index.tsx`))
  })
  return pageMap
}

export function getHashPath() {
  return location.hash.replace('#', '') || '/'
}
