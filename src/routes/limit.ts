import { filterTree, mapTree } from 'amis/lib/utils/helper'
import isArray from 'lodash/isArray'
import map from 'lodash/map'

import { routeLimitKey } from '~/constants'
import logger from '~/utils/logger'
import { getStore, setStore } from '~/utils/store'
import { isSubStr } from '~/utils/tool'

import { getRouteConfig, routesConfig } from './config'
import { Limit, LimitMenuItem, RouteItem } from './types'
import { getPageFilePath, getPagePreset } from './utils'

const log = logger.getLogger('dev:routes:limit')

// 处理 preset.limits.needs 配置的数据
const resolveLimitNeeds = (key: string, limits: Types.ObjectOf<Limit>): string[] => {
  const checked: Types.ObjectOf<boolean> = {}

  const { needs = [] } = limits[key]

  // 便利所有节点
  const getNeeds = (node: string[] = []) => {
    // 防止循环依赖
    node.map((k: string) => {
      if (!checked[k]) {
        checked[k] = true
        return getNeeds(limits[k]?.needs)
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

// 权限配置表
export const limitMenusConfig = mapTree<LimitMenuItem>(routesConfig, (item) => {
  const newItem = { ...item }
  const { nodePath } = newItem

  const preset = getPagePreset(getPageFilePath(item))

  const { limits, apis } = preset || {}

  // limits 表示 当前节点 有子权限
  if (limits) {
    newItem.children = map(limits, ({ icon, label, description }, key) => {
      const needs =
        key === routeLimitKey
          ? undefined
          : resolveLimitNeeds(key, limits).map((needK: string) => `${nodePath}/${needK}`)

      return {
        label,
        description,
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
      const { key: apiAuthKey, url, limits: apiNeeds } = apiItem
      const presetApiNeeds = typeof apiNeeds === 'string' ? [apiNeeds] : apiNeeds
      allApis[apiKey] = {
        url,
        key: apiAuthKey,
        limits: presetApiNeeds?.concat(routeLimitKey),
      }
    })
    newItem.apis = {
      ...newItem.apis,
      ...allApis,
    }
  }

  // 添加默认 icon
  newItem.icon = newItem.icon ? newItem.icon : 'fa fa-code-fork'

  // console.log('-----', routePath, newItem)
  return newItem
})

// 将字符串格式的权限数据，转为对象类型，可大大减少权限匹配的时间
export const convertLimitStr = (limitStr: string) => {
  const tpl: Types.ObjectOf<boolean> = {}
  const limits = limitStr?.split(',')

  limits?.forEach((key) => {
    tpl[key] = true
  })

  return tpl
}

// 循环调用时一定要 传 limits 参数
export const checkLimitByNodePath = (nodePath: string, limits: any = limitStore('get')) => {
  // 子权限存在，父权限一定存在
  return limits[nodePath] || Object.keys(limits).some((i) => isSubStr(i, `${nodePath}/`, 0))
}

// 校验一组权限
export const checkLimitByKeys = (
  limitKeys?: string | string[],
  option?: {
    nodePath?: string
    limits?: any
  }
) => {
  if (!limitKeys) {
    return false
  }

  const { nodePath = '', limits } = option || {}
  const thisLimits = limits || limitStore('get')
  const checkAr = typeof limitKeys === 'string' ? [limitKeys] : limitKeys

  if (!isArray(checkAr)) {
    log.warn('checkLimitByKeys limitKeys 必须是字符串', limitKeys)
    return false
  }

  return !checkAr?.some((key) => {
    const checkKey = isSubStr(key, '/') ? key : `${nodePath}/${key}`
    return !checkLimitByNodePath(checkKey, thisLimits)
  })
}

// TODO: 将limits对象存在 内存中，因为组件会频繁读取
export const limitStore: Types.ValueCtrl = (type, value) => {
  if (type === 'get') {
    return convertLimitStr(getStore('limit') || '')
  }
  setStore('limit', value)
}

// 过滤掉 配置路由信息
// 1. 去除无权限路由
// 2. 去除侧边栏隐藏 菜单项
const filterRoutesConfig = (type: 'aside' | 'route') => {
  const limits = limitStore('get')
  if (!Object.keys(limits).length) {
    return []
  }

  return filterTree<RouteItem>(getRouteConfig(), ({ sideVisible, nodePath }) => {
    const auth = checkLimitByNodePath(nodePath, limits)
    if (nodePath === '/') {
      return true
    }
    switch (type) {
      case 'route':
        return auth
      case 'aside':
        return auth && sideVisible !== false
    }
  })
}

export const limitedRoutesConfig = filterRoutesConfig('route')

export const asideMenuConfig = filterRoutesConfig('aside')

// console.log('asideMenuConfig===', routesConfig, limitMenusConfig, asideMenuConfig)
