/**
 * APP 权限配置表处理
 * TODO: 添加 unit test
 */

import { filterTree, mapTree } from 'amis/lib/utils/helper'
import { map, isEmpty, pick, cloneDeep, get } from 'lodash'

import { app } from '@/app'
import { routeLimitKey, message } from '@/constants'
import { getPagePreset } from '@/routes/exports'
import { subscribe } from '@/utils/message'
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
const store: StoreType = {
  asideMenus: [],
  authRoutes: [],
  limitMenus: [],
}

subscribe(message.updateRouteStore, () => {
  store.asideMenus = []
  store.authRoutes = []
  store.limitMenus = []
})

// 过滤掉 配置路由信息
// 1. 去除无权限路由
// 2. 去除侧边栏隐藏 菜单项
const filterRoutesConfig = (type: 'aside' | 'route') => {
  const limits = getAppLimits()

  // 不校验权限 并且 limits 数据为空时
  if (!app.env.disableLimit && isEmpty(limits)) {
    // 页面路由什么都没有
    return []
  }

  const nodes = filterTree<RouteItem>(getRouteConfig(true), (item) => {
    const { sideVisible, nodePath, limitOnly } = item
    const auth = checkLimitByNodePath(nodePath, limits)
    if (nodePath === '/') {
      return true
    }

    switch (type) {
      case 'aside':
        return auth && limitOnly !== true && sideVisible !== false
      default:
        return auth
    }
  })

  return nodes
}

// 可用路由权限---注意页面内操作权限没有校验
export const getAuthRoutes = (): RouteItem[] => {
  if (store.authRoutes?.length) {
    return store.authRoutes
  }
  store.authRoutes = filterRoutesConfig('route') as any

  return store.authRoutes
}

// 侧边栏 展示菜单配置
export const getAsideMenus = (): RouteItem[] => {
  if (store.asideMenus?.length) {
    return store.asideMenus
  }
  store.asideMenus = filterRoutesConfig('aside') as any
  return store.asideMenus
}

// 权限配置表
export const getLimitMenus = (option?: {
  refresh?: boolean // 是否为独立数据
  useAllLimit?: boolean // 是否全部权限
}) => {
  const { refresh = false, useAllLimit = false } = option || {}
  if (!refresh && store.limitMenus.length) {
    return store.limitMenus
  }

  const userRoutes = useAllLimit ? getRouteConfig(true) : cloneDeep(getAuthRoutes())

  // 构建权限配置面板菜单结构
  const limitMenus = mapTree(userRoutes as LimitMenuItem[], (item) => {
    const { nodePath } = item

    const preset = getPagePreset(item) || pick(item, ['apis', 'limits'])

    const { limits, apis } = preset

    // limits 表示 当前节点 有子权限
    if (limits) {
      item.children = map(limits, ({ icon, label }, key) => {
        const needs =
          key === routeLimitKey
            ? undefined
            : resolveLimitNeeds(key, limits).map((needK: string) => `${nodePath}/${needK}`)

        return {
          label,
          needs,
          icon: icon || 'fa fa-code',
          nodePath: `${nodePath}/${key}`,
        }
      })
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
    store.limitMenus = limitMenus
    return store.limitMenus
  }

  const appLimits = getAppLimits()
  store.limitMenus = filterTree<RouteItem>(limitMenus, ({ nodePath }) => {
    return nodePath === '/' ? true : checkLimitByNodePath(nodePath, appLimits)
  })

  return store.limitMenus
}
