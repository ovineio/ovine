import React, { lazy } from 'react'
import { Route } from 'react-router-dom'

import logger from '@utils/logger'
import { deepClone, deepTraversal } from '@utils/tool'
import MainLayout from '@widgets/layout/main'

import { routesConfig } from './config'
import { getHashPageMap, parseRoutesConfig } from './func'

// import BlankLayout from '@widgets/layout/blank'

export const flatRoutesConfig = deepTraversal(parseRoutesConfig(deepClone(routesConfig)))

export const hashRoutesMap = getHashPageMap(flatRoutesConfig)

logger.getLogger('app:route').log({ routesConfig, flatRoutesConfig, hashRoutesMap })

export const MainLayoutRoutes = <Route path="/" exact component={MainLayout} />

export const BlankLayoutRoutes = (
  <Route path="/login" component={lazy(() => import('@pages/login'))} />
)
