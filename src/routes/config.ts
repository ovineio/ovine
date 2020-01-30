import { filterTree } from 'amis/lib/utils/helper'

import amisRoute from './menus/amis'
import appRoute from './menus/app'

export const routesConfig = [appRoute, amisRoute]
export const menusConfig = filterTree(routesConfig, (item) => item.sideVisible !== false)
