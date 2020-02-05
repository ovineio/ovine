import { filterTree } from 'amis/lib/utils/helper'
import cloneDeep from 'lodash/cloneDeep'

import amisRoute from './menus/amis'
import appRoute from './menus/app'

export const routesConfig = [appRoute, amisRoute]
export const menusConfig = filterTree(cloneDeep(routesConfig), (item) => item.sideVisible !== false)
