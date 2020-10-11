/**
 * 路由状态持久化
 *
 * 1. 记录 打开着的 路由
 * 2. 记录 url 地址参数
 */

import { app } from '@/app'
import { storage } from '@/constants'
import { getStore, setStore, clearStore } from '@/utils/store'

import { TabItem } from './index'

type List = TabItem[]

export const getCachedTabs = () => {
  const list: List = getStore<List>(storage.routeTabs) || []
  return list
}

export const clearCachedTabs = () => {
  clearStore(storage.routeTabs)
}

export const cacheTabs = (allTabs: any) => {
  const list: List = []
  allTabs.forEach((tabEl: HTMLDivElement) => {
    const { path: pathname = '', root: isRoot = '' } = tabEl.dataset

    // 404 不缓存
    if (app.constants.notFound.route === pathname) {
      return
    }

    const label = tabEl.querySelector('.chrome-tab-title')?.innerHTML || ''
    const item: TabItem = { pathname, label }

    if (isRoot) {
      item.isRoot = true
    }

    if (tabEl.hasAttribute('active')) {
      item.active = true
    }

    list.push(item)
  })

  setStore(storage.routeTabs, list)
}
