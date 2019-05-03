import { lazy } from 'react'
import { renderRoutes } from 'react-router-config'
import Layout from '@widgets/layout/main'
import { deepTraversal } from '@utils/tool'
import routesConfig, { RouteConfig } from './config'

const routes: any = {
  component: Layout,
}

type Config = RouteConfig & {
  component?: any
}

routes.routes = deepTraversal<Config>(
  routesConfig,
  (item) => {
    item.component = lazy(() => import(`@pages/${item.componentPath}/index.tsx`))
    return item
  },
  'routes'
)

export default renderRoutes([routes])
