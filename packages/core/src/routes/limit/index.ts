/**
 * APP 权限配置表处理
 * TODO: 添加 unit test
 */

import { filterTree, mapTree } from 'amis/lib/utils/helper'
import { map, isEmpty, pick, cloneDeep, get } from 'lodash'

import { app } from '@/app'
import { routeLimitKey, parentKey, storage } from '@/constants'
import { getPagePreset } from '@/routes/exports'
import { getGlobal, setGlobal } from '@/utils/store'
import * as Types from '@/utils/types'

import { getRouteConfig } from '../config'
import { Limit, LimitMenuItem, RouteItem } from '../types'

import { checkLimitByNodePath, getAppLimits } from './exports'

// 处理 preset.limits.needs 配置的数据
const resolveLimitNeeds = (key: string, limits: Types.ObjectOf<Limit>): string[] => {
  const checked: Types.ObjectOf<boolean> = {}

  const { needs = [] } = limits[key]

  // 便利所有节点
  const getNeeds = (node: string[] = []) => {
    // 防止循环依赖
    node.forEach((k: string) => {
      if (!checked[k]) {
        checked[k] = true
        getNeeds(limits[k]?.needs)
      }
    })
  }

  // 添加默认 $page 页面权限
  if (limits[routeLimitKey] && !checked[routeLimitKey]) {
    checked[routeLimitKey] = true
    needs.push(routeLimitKey)
  }

  getNeeds(needs)

  return Object.keys(checked)
}

type StoreType = {
  asideMenus: any[]
  authRoutes: any[]
  limitMenus: LimitMenuItem[]
}
const getStore = (type: keyof StoreType): any[] => {
  const store = getGlobal<any>(storage.routeData) || {}
  return store[type] || []
}

const setStore = (type: keyof StoreType, data: any[]) => {
  const store = getGlobal<any>(storage.routeData)
  store[type] = data
  setGlobal(storage.routeData, store)
}

export const clearRouteStore = () => {
  setGlobal(storage.routeData, {})
}

// 过滤掉 配置路由信息
// 1. 去除无权限路由
// 2. 去除侧边栏隐藏 菜单项
const filterRoutesConfig = (type: 'aside' | 'route' | 'limit') => {
  const limits = getAppLimits()

  // 不校验权限 并且 limits 数据为空时
  if (!app.env.disableLimit && isEmpty(limits)) {
    // 页面路由什么都没有
    return []
  }

  const nodes = filterTree<RouteItem>(getRouteConfig(true), (item) => {
    const { nodePath, ignoreLimit, limitOnly } = item
    const auth = ignoreLimit === true ? true : checkLimitByNodePath(nodePath, limits)

    if (nodePath === '/' && !limitOnly) {
      return true
    }

    switch (type) {
      case 'aside':
        return auth && limitOnly !== true
      case 'limit':
        return !ignoreLimit && auth
      default:
        return auth
    }
  })

  return nodes
}

// 可用路由权限---注意页面内操作权限没有校验
export const getAuthRoutes = (): RouteItem[] => {
  if (getStore('authRoutes').length) {
    return getStore('authRoutes')
  }
  const authRoutes = filterRoutesConfig('route')
  setStore('authRoutes', authRoutes)
  return authRoutes
}

// 侧边栏 展示菜单配置
export const getAsideMenus = (): RouteItem[] => {
  if (getStore('asideMenus').length) {
    return getStore('asideMenus')
  }
  const asideMenus = filterRoutesConfig('aside')
  setStore('asideMenus', asideMenus)
  return asideMenus
}

// 权限配置表
export const getLimitMenus = (option?: {
  refresh?: boolean // 是否为独立数据
  useAllLimit?: boolean // 是否全部权限
}) => {
  const { refresh = false, useAllLimit = false } = option || {}
  if (!refresh && getStore('limitMenus').length) {
    return getStore('limitMenus')
  }

  const userRoutes = useAllLimit ? getRouteConfig(true) : cloneDeep(filterRoutesConfig('limit'))

  // 构建权限配置面板菜单结构
  const limitMenus = mapTree(userRoutes as LimitMenuItem[], (item) => {
    const { nodePath, children } = item

    const preset = getPagePreset(item) || pick(item, ['apis', 'limits'])

    const { limits, apis } = preset

    // limits 表示 当前节点 有子权限
    if (limits) {
      const limitNodePath = children ? `${nodePath}/${parentKey}` : nodePath
      const limitItems = map(limits, ({ icon, label }, key) => {
        const needs =
          key === routeLimitKey
            ? undefined
            : resolveLimitNeeds(key, limits).map((needK: string) => `${limitNodePath}/${needK}`)

        return {
          label,
          needs,
          icon: icon || 'fa fa-code',
          nodePath: `${limitNodePath}/${key}`,
        }
      })
      if (children) {
        children.unshift({
          icon: 'fa fa-code-fork',
          nodePath: limitNodePath,
          label: `${item.label}-权限`,
          children: limitItems,
        } as any)
      } else {
        item.children = limitItems
      }
    }

    // 将 preset 配置的 apis， 添加到权限配置表中
    if (apis) {
      const allApis: any = {}
      map(apis, (apiItem, apiKey) => {
        const { key: apiAuthKey, url, limits: apiLimits } = apiItem
        const presetApiLimits =
          !apiLimits || typeof apiLimits === 'string' ? [apiLimits] : apiLimits

        allApis[apiKey] = {
          url,
          key: apiAuthKey,
          limits: !get(limits, routeLimitKey)
            ? presetApiLimits
            : presetApiLimits?.concat(routeLimitKey),
        }
      })
      item.apis = {
        ...item.apis,
        ...allApis,
      }
    }

    // 添加默认 icon
    item.icon = item.icon ? item.icon : 'fa fa-code-fork'

    return item
  })

  if (useAllLimit) {
    setStore('limitMenus', limitMenus)
    return limitMenus
  }

  const appLimits = getAppLimits()
  const filteredLimitMenus = filterTree<RouteItem>(limitMenus, ({ nodePath }) => {
    return nodePath === '/' ? true : checkLimitByNodePath(nodePath, appLimits)
  })
  setStore('limitMenus', filteredLimitMenus)
  return filteredLimitMenus
}
