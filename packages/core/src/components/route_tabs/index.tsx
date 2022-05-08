/**
 * 路由切换器 组件
 *
 * TODO:
 * 1. 添加 ICON 支持，showIcon, RouteIcon 请求中 LoadingIcon 之类的
 * 2. 增加 可编辑/固定 模式
 * 3. 将组件转为 纯 react 组件，容易控制
 */

import { openContextMenus } from 'amis'
import { MenuItem, MenuDivider } from 'amis/lib/components/ContextMenu'
import { findTree } from 'amis/lib/utils/helper'
import { History } from 'history'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { matchPath, withRouter } from 'react-router-dom'

import { app } from '@/app'
import { message, storage as storeKeys, rootRoute as defRouteRoute } from '@/constants'
import { getCurrRoutePath } from '@/routes/exports'
import { RouteItem } from '@/routes/types'
import { subscribe, unsubscribe } from '@/utils/message'
import { setGlobal } from '@/utils/store'

import * as cache from './cache'
import ChromeTabs from './chrome_tabs'
import { StyledRouteTabs } from './styled'

export type RouteMenuItem = Array<MenuItem | MenuDivider>
type Props = {
  themeNs: string
  routes: RouteItem[]
  history: History
  rootRoute?: string
  maxCount?: number
  storage?: boolean
  onContextMenu?: (menus: RouteMenuItem, routeItem: TabItem) => RouteMenuItem
}

export type TabItem = Partial<Omit<RouteItem, 'id'>> & {
  pathname: string
  label: string
  // initQuery?: any
  id?: string | number
  shared?: boolean
  isRoot?: boolean
  active?: boolean
  state?: string
}

type RefType = {
  $tabs: any
  $tabsDom: HTMLDivElement | null
  rootRoute: string
  tabs: any
  routeQuery: any
  routes: RouteItem[]
}

const RouteTabs = (props: Props) => {
  const {
    routes: routesProp,
    themeNs,
    history,
    maxCount = 20,
    storage,
    rootRoute: rootRouteProp = defRouteRoute,
    onContextMenu,
  } = props

  const { location } = history

  const $storeRef = useRef<RefType>({
    rootRoute: rootRouteProp,
    routeQuery: {},
    routes: routesProp,
    $tabsDom: null,
    $tabs: undefined,
    tabs: {},
  })

  $storeRef.current.rootRoute = rootRouteProp
  $storeRef.current.routes = routesProp

  const notFindRoute: TabItem = {
    label: '页面不存在',
    pathname: app.constants.notFound.route,
  }

  // TODO: 优化跳转逻辑，跳转路由
  const changePath = debounce((path: string) => {
    history.replace(path)
  }, 100)

  const routeQueryCtrl = (path: string, val = '') => {
    if (path === '') {
      $storeRef.current.routeQuery = {}
      setGlobal(storeKeys.routeQuery, {})
      return
    }

    $storeRef.current.routeQuery[path] = val
    setGlobal(storeKeys.routeQuery, $storeRef.current.routeQuery)
  }

  // 获取路径信息
  const getRouteInfo = (path: string = getCurrRoutePath()) => {
    let rootBackItem: TabItem | undefined
    let matchedItem: TabItem | undefined
    const { rootRoute, routes } = $storeRef.current
    findTree(routes, (item, _, __, items) => {
      const {
        limitLabel,
        // routeTabInitQuery: initQuery,
        exact,
        strict,
        path: routePath = '',
        nodePath = '',
      } = item
      const pathname = routePath || nodePath
      const label = item.label || limitLabel || notFindRoute.label

      if (!path || path === rootRoute) {
        const rootItem = { ...item, label, pathname: rootRoute, isRoot: true }
        if (routePath === rootRoute) {
          matchedItem = rootItem // 设置的 rootPath
        } else if (nodePath === rootRoute) {
          rootBackItem = rootItem // 默认 root
        }
        return false
      }

      const match = matchPath(path, {
        path: pathname,
        exact,
        strict,
      })
      const isMatch = match?.url === path

      if (isMatch) {
        const shared = !!findTree(items, (i) => i.routeTabShared)
        matchedItem = { ...item, label, pathname: path, shared }
      }

      return isMatch
    })

    const curr = matchedItem || rootBackItem || notFindRoute

    return curr
  }

  // 清空所有时 默认跳到 首页
  const onClearAll = (tabDom?: any, refreshRoot = true) => {
    const { tabs } = $storeRef.current
    routeQueryCtrl('')
    // 防止首次进入页面 直接刷新两次
    if (refreshRoot !== false && getCurrRoutePath() !== $storeRef.current.rootRoute) {
      changePath($storeRef.current.rootRoute)
    }
    setTimeout(() => {
      if (tabDom) {
        tabs.removeTab(tabDom, { autoActive: false })
      } else {
        tabs.tabEls.forEach((tabEl: any) => {
          if (tabEl.dataset.root !== $storeRef.current.rootRoute) {
            tabs.removeTab(tabEl, { autoActive: false })
          }
        })
      }
      cache.clearCachedTabs()
    }, 100)
  }

  const onRemove = (tabEl: any) => {
    const { tabs } = $storeRef.current
    if (tabs.tabEls.length !== 1) {
      routeQueryCtrl(tabEl.dataset.path, '')
      tabs.removeTab(tabEl)
      return
    }
    if (!tabEl.dataset.root) {
      onClearAll(tabEl)
    }
  }

  const onItemMenus = (e: MouseEvent) => {
    if (e.button !== 2) {
      return
    }
    const target = e.currentTarget as HTMLDivElement
    const { tabs } = $storeRef.current
    const allTabs = tabs.tabEls
    const onlyOne = allTabs.length === 1
    const isLastOne = onlyOne ? true : allTabs[allTabs.length - 1] === target

    const actions: any = [
      tabs.activeTabEl === target && {
        label: '刷新页面',
        onSelect: () => {
          // TODO: 刷新页面 会丢失 查询参数
          changePath(target.dataset.path || $storeRef.current.rootRoute)
        },
      },
      !onlyOne && {
        label: '关闭其他',
        onSelect: () => {
          allTabs.forEach((tabEl: any) => {
            if (tabEl !== target) {
              tabs.removeTab(tabEl)
            }
          })
          cache.cacheTabs(tabs.tabEls)
        },
      },
      !onlyOne &&
        !isLastOne && {
          label: '关闭右边',
          onSelect: () => {
            let isAfter = false
            allTabs.forEach((tabEl: any) => {
              if (tabEl === target) {
                isAfter = true
              } else if (isAfter) {
                tabs.removeTab(tabEl)
              }
            })
            cache.cacheTabs(tabs.tabEls)
          },
        },
      !onlyOne && {
        label: '关闭所有',
        onSelect: onClearAll,
      },
    ].filter(Boolean)

    const routeItemInfo = {
      ...getRouteInfo(),
      isRoot: !!target.dataset.root,
      active: target.hasAttribute('active'),
    }

    const menus = onContextMenu ? onContextMenu(actions, routeItemInfo) : actions

    openContextMenus(
      {
        x: e.clientX,
        y: e.clientY,
      },
      menus
    )
  }

  const onMounted = () => {
    const $tabs = $($storeRef.current.$tabsDom)
    const tabs = new ChromeTabs()
    const tabsEle = $tabs.get(0)
    tabs.init(tabsEle)
    $storeRef.current.$tabs = $tabs
    $storeRef.current.tabs = tabs

    $tabs.on('contextmenu', () => false).on('mousedown', '.chrome-tab', onItemMenus)

    tabsEle.addEventListener('activeTabChange', ({ detail }: any) => {
      const { tabEl, tabProperties = {} } = detail
      const { changeRoute, isAdd } = tabProperties

      const { path = '', state = '' } = tabEl.dataset

      cache.cacheTabs(tabs.tabEls)

      // 添加时 ， 路由相同 ， 明确标明， 情况下，不需要跳转路由
      if (!changeRoute || isAdd || window.location.pathname === path) {
        return
      }

      // 携带状态信息一起跳转
      changePath(`${path}${!state ? '' : `?${state}`}`)
    })

    tabsEle.addEventListener('tabAdd', ({ detail }: any) => {
      const { tabEl, tabProperties } = detail
      const { pathname, isRoot } = tabProperties
      tabEl.dataset.path = pathname || ''
      tabEl.dataset.root = isRoot ? pathname : ''
    })

    tabsEle.addEventListener('onTabRemove', ({ detail }: any) => {
      onRemove(detail.tabEl)
    })

    subscribe(message.clearRouteTabs, ({ refreshRoot }) => {
      onClearAll(undefined, refreshRoot)
    })

    subscribe(message.routeTabChange, () => {
      const query = window.location.href.split('?')[1] || ''
      routeQueryCtrl(tabs.activeTabEl.dataset.path, query)
      tabs.activeTabEl.dataset.state = query
    })
  }

  const onUnmounted = () => {
    unsubscribe([message.clearRouteTabs, message.routeTabChange])
  }

  useEffect(() => onUnmounted, [])

  useEffect(() => {
    const isMounted = !!$storeRef.current.$tabs

    // 未初始化 先初始化
    if (!isMounted) {
      onMounted()
    }

    const { tabs, $tabs } = $storeRef.current
    const curr = getRouteInfo(location.pathname)

    // 初次加载 首页时，回归上次一次 active tab
    if (!isMounted && curr.pathname === $storeRef.current.rootRoute) {
      const tabEl = $tabs.find('.chrome-tab[data-active]').get(0)
      if (tabEl) {
        tabs.setCurrentTab(tabEl, { changeRoute: false })
        return
      }
    }

    // 已经 在列表的 直接 定位当前路由
    const tabEl = $tabs.find(`.chrome-tab[data-path="${curr.pathname}"]`).get(0)
    if (tabEl) {
      // tabEl.dataset.state = '' // 清除当前状态
      tabs.setCurrentTab(tabEl, { changeRoute: false })
      return
    }

    // 超出最大值 先移除最左边的
    if (tabs.tabEls.length >= maxCount) {
      tabs.removeTab(tabs.tabEls[0], { autoActive: false })
    }

    // 共享 routeTab
    if (curr.shared) {
      const $shared = $tabs.find('.chrome-tab[data-active]')
      const sharedEl = $shared.get(0)
      if (sharedEl) {
        $shared.find('.chrome-tab-title').html(curr.label)
        sharedEl.dataset.state = '' // 清除当前状态
        sharedEl.dataset.path = curr.pathname
        cache.cacheTabs(tabs.tabEls)
        return
      }
    }

    // 添加一个tab
    tabs.addTab(curr)
  }, [location])

  const Tabs = useMemo(() => {
    const tabItems = !storage ? [] : cache.getValidCacheTabs()

    return (
      <div
        className="chrome-tabs"
        ref={(dom) => {
          $storeRef.current.$tabsDom = dom
        }}
      >
        <div className="chrome-tabs-content">
          {tabItems.map((item) => (
            <div
              key={item.id}
              className="chrome-tab"
              data-root={item.isRoot ? item.pathname : ''}
              data-path={item.pathname}
            >
              <div className="chrome-tab-dividers" />
              <div className="chrome-tab-background">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
                      <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
                    </symbol>
                    <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
                      <use xlinkHref="#chrome-tab-geometry-left" />
                    </symbol>
                    <clipPath id="crop">
                      <rect className="mask" width="100%" height="100%" x="0" />
                    </clipPath>
                  </defs>
                  <svg width="52%" height="100%">
                    <use
                      xlinkHref="#chrome-tab-geometry-left"
                      width="214"
                      height="36"
                      className="chrome-tab-geometry"
                    />
                  </svg>
                  <g transform="scale(-1, 1)">
                    <svg width="52%" height="100%" x="-100%" y="0">
                      <use
                        xlinkHref="#chrome-tab-geometry-right"
                        width="214"
                        height="36"
                        className="chrome-tab-geometry"
                      />
                    </svg>
                  </g>
                </svg>
              </div>
              <div className="chrome-tab-content">
                <div className="chrome-tab-favicon" />
                <div className="chrome-tab-title">{item.label}</div>
                <div className="chrome-tab-drag-handle" />
                <div className="chrome-tab-close">
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2352"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="200"
                    height="200"
                  >
                    <path
                      d="M518.5815877 469.42879156L240.02576609 190.87364889a34.76142882 34.76142882 0 1 0-49.17520097 49.12971238l278.55446374 278.57822643L190.85056508 797.15913522a34.76142882 34.76142882 0 1 0 49.15279619 49.15211725l278.57822651-278.55446378 278.57822634 278.55446378a34.76142882 34.76142882 0 1 0 49.15211728-49.12903345l-278.55446374-278.60063124 278.55446374-278.55514271a34.76142882 34.76142882 0 1 0-49.15211728-49.15279622L518.60467145 469.42879156z"
                      p-id="2353"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }, [])

  return (
    <StyledRouteTabs className={`${themeNs}RouteTabs chrome-route-tabs`}>{Tabs}</StyledRouteTabs>
  )
}

export default withRouter<any, any>(RouteTabs) as any
