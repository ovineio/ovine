import React, { lazy } from 'react'
import { Route } from 'react-router-dom'

import logger from '@utils/logger'
import MainLayout from '@widgets/layout/main'

import { flatRoutesConfig } from './config'

// import BlankLayout from '@widgets/layout/blank'

export function getHashPath() {
  return location.hash.replace('#', '') || '/'
}

export function getHashPageMap() {
  const pageMap: CustomTypes.ObjectOf<React.LazyExoticComponent<() => JSX.Element>> = {}
  flatRoutesConfig.map((route) => {
    const { path, componentPath } = route
    pageMap[path] = lazy(() => import(`@pages/${componentPath}/index.tsx`))
  })
  return pageMap
}

export const hashRoutesMap = getHashPageMap()
logger.getLogger('app:route').log('hashRoutesMap', hashRoutesMap)

export const MainLayoutRoutes = <Route path="/" exact component={MainLayout} />

export const BlankLayoutRoutes = (
  <Route path="/login" component={lazy(() => import('@pages/login'))} />
)
