import React, { lazy } from 'react'
import { Route } from 'react-router-dom'

// import BlankLayout from '@widgets/layout/blank'
import MainLayout from '@widgets/layout/main'

// const mapComponent = (configRoutes: RouteConfig[]): any[] => {
//   return configRoutes.map((route: RouteConfig) => {
//     const { path, componentPath } = route

//     if (componentPath) {
//       route.component = lazy(() => import(`@pages/${componentPath}/index.tsx`))
//     }
//     if (route.routes) {
//       if (route.component) {
//         return mapComponent(route.routes)
//       } else {
//         return route.routes.map((item) => {
//           item.path = `${path}${item.path}`
//           if (item.componentPath) {
//             item.component = lazy(() => import(`@pages/${item.componentPath}/index.tsx`))
//           }
//           return item
//         })
//       }
//     }
//     return route
//   })
// }

// export function mathHashPath() {
//   const hashPath = location.hash.replace('#', '')

// }

export function getHashPath() {
  return location.hash.replace('#', '') || '/'
}

export const hashRoutes: CustomTypes.ObjectOf<React.LazyExoticComponent<() => JSX.Element>> = {
  '/': lazy(() => import('@pages/home')),
  '/xxx': lazy(() => import('@pages/demo')),
  '/yyy/xxx': lazy(() => import('@pages/home')),
}

export const MainLayoutRoutes = <Route path="/" exact component={MainLayout} />

export const BlankLayoutRoutes = (
  <Route path="/login" component={lazy(() => import('@pages/login'))} />
)
