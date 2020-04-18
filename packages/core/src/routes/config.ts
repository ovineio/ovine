/**
 * App route 配置
 * TODO: 添加 unit test
 */

import { mapTree } from 'amis/lib/utils/helper'
import { cloneDeep, last } from 'lodash'

import { RouteItem } from './types'

let routesConfig: RouteItem[] = []
// 解析配置的路由数据
// 1. 根据 nodePath 生成默认 path 路径值
const resolveRouteConfig = (nodes: RouteItem[]) => {
  return mapTree(nodes, (item, _, __, itemNodes) => {
    const { path, label, nodePath, children, pathToComponent } = item

    item.nodePath = `${last(itemNodes)?.nodePath || ''}/${nodePath}`.replace(/(\/\/)/g, '/')
    item.nodeLabel = `${last(itemNodes)?.label || ''}/${label}`

    if (!path && (pathToComponent || (!children && !pathToComponent))) {
      item.path = item.nodePath
    }

    return item
  })
}

export function setRoutesConfig(routes: RouteItem[]) {
  routesConfig = resolveRouteConfig(routes)
  return routesConfig
}

// 防止修改原始数据
export function getRouteConfig(fresh?: boolean) {
  if (fresh) {
    return cloneDeep(routesConfig)
  }
  return routesConfig
}
