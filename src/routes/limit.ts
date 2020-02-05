import { mapTree } from 'amis/lib/utils/helper'
import map from 'lodash/map'

import { routeLimitKey } from '~/constants'

import { routesConfig } from './config'
import { Limit, LimitMenuItem } from './types'
import { getPageFilePath, getPagePreset, getRoutePath } from './utils'

// 解析页面内 配置的权限依赖
const resolveLimitNeeds = (key: string, limits: Types.ObjectOf<Limit>): string[] => {
  const checked: Types.ObjectOf<boolean> = {}

  const { needs = [] } = limits[key]

  // 便利所有节点
  const getNeeds = (node: string[] = []) => {
    // 防止循环依赖
    node.map((k: string) => {
      if (!checked[k]) {
        checked[k] = true
        return getNeeds(limits[k]!.needs)
      }
    })
  }

  // 添加默认 $page 页面权限
  if (!checked[routeLimitKey]) {
    checked[routeLimitKey] = true
    needs.push(routeLimitKey)
  }

  getNeeds(needs)

  return Object.keys(checked)
}

export const limitMenusConfig = mapTree<LimitMenuItem>(routesConfig, (item) => {
  const newItem = { ...item }
  const { path, limitKey } = newItem

  // 路由中间节点， 统一不设置权限
  if (!path && !limitKey) {
    newItem.limitKey = '_'
    return newItem
  }

  const filePath = getPageFilePath(item)
  const preset = getPagePreset(filePath) || {}
  const routePath = getRoutePath(path || '')

  // 有子权限 limits 配置的根结点
  const { limits } = preset
  if (limits) {
    newItem.children = map(limits, ({ icon, label, description }, key) => {
      const needs =
        key === routeLimitKey
          ? undefined
          : resolveLimitNeeds(key, limits).map((needK: string) => `${routePath}/${needK}`)

      return {
        label,
        description,
        needs,
        icon: icon || 'fa fa-code',
        limitKey: `${routePath}/${key}`,
      }
    })
  }

  // 页面节点，且无子权限 limits
  if (!limitKey) {
    newItem.icon = newItem.icon ? newItem.icon : 'fa fa-code-fork'
    newItem.limitKey = `${routePath}`
  }

  // console.log('-----', routePath, newItem)
  return newItem
})

// 过滤 路由权限
export const limitedRouteConfig = () => {
  //
}
