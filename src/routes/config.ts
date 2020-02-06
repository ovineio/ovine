import { mapTree } from 'amis/lib/utils/helper'
import cloneDeep from 'lodash/cloneDeep'
import last from 'lodash/last'

import appRoute from './menus/app'
import { RouteItem } from './types'

// import amisRoute from './menus/amis'

const originConfig = [appRoute]

// 解析配置的路由数据
// 1. 根据 nodePath 生成默认 path 路径值
const resolveRouteConfig = (nodes: RouteItem[]) => {
  return mapTree(nodes, (item, _, __, itemNodes) => {
    const { path, nodePath, children, pathToComponent } = item

    item.nodePath = `${last(itemNodes)?.nodePath || ''}/${nodePath}`.replace(/(\/\/)/g, '/')

    if (!path && (pathToComponent || (!children && !pathToComponent))) {
      item.path = item.nodePath
    }

    return item
  })
}

export const routesConfig = resolveRouteConfig(originConfig)

// 防止修改原始数据
export const getRouteConfig = () => {
  return cloneDeep(routesConfig)
}
