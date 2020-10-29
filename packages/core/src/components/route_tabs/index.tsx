/**
 * 路由切换器 组件
 *
 * TODO:
 * 1. 添加懒加载优化
 * 2. 菜单UI美化，主题UI
 * 3. 添加 RouteIcon 已经请求 LoadingIcon 之类的
 */

import { openContextMenus } from 'amis'
import { findTree } from 'amis/lib/utils/helper'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import { app } from '@/app'
import { rootPath } from '@/constants'
import { RouteItem } from '@/routes/types'

import * as cache from './cache'
import ChromeTabs from './chrome_tabs'
import { StyledRouteTabs } from './styled'

type Props = {
  themeNs: string
  routes: RouteItem[]

  maxCount?: number
  storage?: boolean
}

export type TabItem = {
  pathname: string
  label: string
  isRoot?: boolean
  active?: boolean
  state?: string
}

const cachedList = cache.getCachedTabs()

type RefType = {
  $tabs: any
  $tabsDom: HTMLDivElement | null
  tabs: any
}
export default (props: Props) => {
  const history = useHistory()

  const { routes, themeNs, maxCount = 100, storage } = props
  const { location } = history

  const $storeRef = useRef<RefType>({
    $tabs: undefined,
    $tabsDom: null,
    tabs: {},
  })

  const notFindRoute: TabItem = {
    label: '页面不存在',
    pathname: app.constants.notFound.route,
  }

  // 跳转路由
  const changePath = debounce((path: string) => {
    history.push(path)
  }, 100)

  // 获取路径信息
  const getPathInfo = (path: string) => {
    let rootBackItem: TabItem | undefined
    let matchedItem: TabItem | undefined
    findTree(routes, (item) => {
      const { limitLabel, nodePath: pathname } = item
      const label = item.label || limitLabel || notFindRoute.label
      if (!path || path === rootPath) {
        if (item.path === rootPath) {
          matchedItem = { label, pathname: rootPath, isRoot: true }
        } else if (item.nodePath === rootPath) {
          rootBackItem = { label, pathname: rootPath, isRoot: true }
        }
        return false
      }
      const isMatch = pathname === path
      if (isMatch) {
        matchedItem = { label, pathname }
      }
      return isMatch
    })

    const curr = matchedItem || rootBackItem || notFindRoute

    return curr
  }

  // 清空所有时 默认跳到 首页
  const onClearAll = (tabDom: any) => {
    const { tabs } = $storeRef.current
    changePath(rootPath)
    setTimeout(() => {
      if (tabDom) {
        tabs.removeTab(tabDom, { autoActive: false })
      } else {
        tabs.tabEls.forEach((tabEl: any) => {
          if (!tabEl.dataset.root) {
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

    if (onlyOne) {
      return
    }

    const actions: any = [
      tabs.activeTabEl === target && {
        label: '刷新页面',
        onSelect: () => {
          changePath(target.dataset.path || rootPath)
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
        },
      },
      !isLastOne && {
        label: '关闭右边',
        onSelect: () => {
          let isAfter = false
          allTabs.forEach((tabEl: any) => {
            if (tabEl === target) {
              isAfter = true
              return
            }
            if (isAfter) {
              tabs.removeTab(tabEl)
            }
          })
        },
      },
      !onlyOne && {
        label: '关闭所有',
        onSelect: onClearAll,
      },
    ].filter(Boolean)

    openContextMenus(
      {
        x: e.clientX,
        y: e.clientY,
      },
      actions
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
      tabEl.dataset.root = isRoot || ''
    })

    tabsEle.addEventListener('onTabChange', () => {
      tabs.activeTabEl.dataset.state = window.location.href.split('?')[1] || ''
    })

    tabsEle.addEventListener('onTabRemove', ({ detail }: any) => {
      onRemove(detail.tabEl)
    })
  }

  useEffect(() => {
    const isInit = !!$storeRef.current.$tabs

    // 未初始化 先初始化
    if (!isInit) {
      onMounted()
    }

    const { tabs, $tabs } = $storeRef.current
    const curr = getPathInfo(location.pathname)

    // 初次加载 首页时，回归上次一次 active tab
    if (!isInit && curr.pathname === rootPath) {
      const tabEl = $tabs.find('.chrome-tab[data-active]').get(0)
      if (tabEl) {
        tabs.setCurrentTab(tabEl)
        return
      }
    }

    // 已经 在列表的 直接 定位当前路由
    const tabEl = $tabs.find(`.chrome-tab[data-path="${curr.pathname}"]`).get(0)
    if (tabEl) {
      tabEl.dataset.state = '' // 清楚当前状态
      tabs.setCurrentTab(tabEl, { changeRoute: false })
      return
    }

    // 超出最大值 先移除最左边的
    if (tabs.tabEls.length >= maxCount) {
      tabs.removeTab(tabs.tabEls[0], { autoActive: false })
    }

    tabs.addTab(curr)
  }, [location])

  const Tabs = useMemo(
    () => (
      <StyledRouteTabs className={`${themeNs}RouteTabs chrome-route-tabs`}>
        <div
          className="chrome-tabs"
          ref={(dom) => {
            $storeRef.current.$tabsDom = dom
          }}
        >
          <div className="chrome-tabs-content">
            {(!storage ? [] : cachedList).map((item) => (
              <div
                className="chrome-tab"
                data-active={item.active}
                data-root={item.isRoot}
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
      </StyledRouteTabs>
    ),
    [themeNs]
  )

  return Tabs
}
