import React, { Suspense } from 'react'
import { render } from 'react-dom'

import '@assets/scripts/context_menu.js'
import '@assets/scripts/context_menu_ui.js'
import { progressJs } from '@assets/scripts/progress.js'
import { cls, filters, getLayId, ids, layId } from '@constants/layui'
import { hashRoutesMap } from '@routes'
import { getHashPath } from '@routes/func'

const pageTabClass = `${cls.show} fadeInUp`
const tabsId = filters.routes_nav_tabs.id
let progressBar: any

type TabItemType = {
  index: number
  type: '' | 'init' | 'delete' | 'change' | 'navChange'
  id: string
  title: string
}

/**
 * TODO 添加 session 存储 已经打开的tabs
 */
export function onTabsInit() {
  layui.use('element', () => {
    const { element } = layui
    renderTabsMenu({ element })

    element.tab({
      headerElem: '',
      bodyElem: '',
    })

    // 第一次初始化  tabs
    const pathName = getHashPath()
    const $initNav = $(`#${ids.app_side} ${getLayId(pathName, true)}`)
    const tabData: TabItemType = {
      id: pathName,
      title: $initNav.data('title'),
      type: 'init',
      index: -1,
    }

    setTimeout(() => fireTabChange({ element, tabData }), 100)

    // 点击 左边栏 导航
    element.on(filters.app_side_nav.nav, ($activeNav: any) => {
      tabData.id = $activeNav.attr(layId)
      if (!tabData.id || getHashPath() === tabData.id) {
        return
      }
      tabData.title = $activeNav.data('title')
      tabData.index = -1
      tabData.type = 'navChange'
      fireTabChange({ element, tabData })
    })

    // tabs 增加/删除/切换都调用该方法 且 参数一致
    element.on(filters.routes_nav_tabs.tabs, (tabs: any) => {
      tabData.index = tabs.index
      tabData.type = tabs.eventType
      changeTab({ element, tabData })
    })
  })
}

function fireTabChange({ element, tabData }: ChangeTabOption) {
  const { title, id } = tabData

  const isTabExist = $(`#${ids.routes_nav_tabs_header} li${getLayId(id, true)}`).length

  if (isTabExist) {
    element.tabChange(tabsId, id)
    return
  }

  element.tabAdd(tabsId, { title, id })
  setTimeout(() => element.tabChange(tabsId, id), 100)
}

type ChangeTabOption = {
  element: any
  tabData: TabItemType
}
function changeTab({ tabData }: ChangeTabOption) {
  const { index, id, type } = tabData

  const pathName =
    index === -1
      ? id
      : $(`#${ids.routes_nav_tabs_header} li`)
          .eq(index)
          .attr(layId)

  if (!pathName) {
    return
  }

  location.hash = pathName

  const layIdStr = getLayId(pathName)
  const $tabsContent: any = $(`#${ids.app_body}`)
  const tabsContentSelector = `.${cls.app_tabs_items}[${layIdStr}]`
  const $currContent = $tabsContent.find(tabsContentSelector)

  renderSideNav(pathName, type !== 'navChange')

  // 删除时 更新 tabContentItem
  if (type === 'delete') {
    const prevId = $(`#${ids.routes_nav_tabs_header} .${cls.this}`).attr(layId)
    $tabsContent.find(`.${cls.app_tabs_items}${getLayId(prevId, true)}`).remove()
  }

  if ($currContent.length) {
    if (!$currContent.hasClass(cls.show)) {
      $currContent
        .addClass(pageTabClass)
        .siblings()
        .removeClass(pageTabClass)
    }
    return
  }

  $tabsContent.find(`.${cls.show}`).removeClass(pageTabClass)
  $tabsContent.append(
    `<div class="animated fast ${cls.app_tabs_items} ${pageTabClass}" ${layIdStr}></div>`
  )

  renderProgressBar()

  const PageComponent = hashRoutesMap[pathName]
  render(
    <Suspense fallback="">
      <PageComponent />
    </Suspense>,
    $tabsContent.find(tabsContentSelector)[0]
  )
}

function renderSideNav(pathName: string, isUpdateShrink: boolean = false) {
  const $side = $(`#${ids.app_side}`)
  const $activeNav = $side.find(`.${cls.this}`)

  if (isUpdateShrink) {
    const itemedCls = '.layui-nav-itemed'
    const $allItems = $side.find(itemedCls)
    $allItems.each((...args: any[]) => {
      const $item = $(args[1])
      if (!$item.find(`a${getLayId(pathName, true)}`).length) {
        $item.removeClass('layui-nav-itemed')
      }
    })
  }

  if ($activeNav.find('a').attr(layId) === pathName) {
    return
  }

  $activeNav.removeClass(cls.this)

  $side
    .find(`a${getLayId(pathName, true)}`)
    .parent()
    .addClass(cls.this)
    .parents('.layui-nav-child,.layui-nav-item')
    .addClass('layui-nav-itemed')
}

function renderProgressBar() {
  if (!progressBar) {
    progressBar = progressJs()
      .start()
      .autoIncrease(20, 500)
    setTimeout(() => {
      progressJs().end()
      progressBar = undefined
    }, 1000)
  }
}

function renderTabsMenu({ element }: any) {
  let selectId = ''
  let currId = ''
  let tabNum = 1

  const removeTabs = (type: 'all' | 'curr') => {
    $(`#${ids.routes_nav_tabs_header} li,.${cls.app_tabs_items}`).each((...args: any[]) => {
      const $this = $(args[1])
      const oprId = type === 'all' ? '/' : selectId
      // console.log('tabNum', currId, oprId, selectId)
      if ([oprId, '/'].indexOf($this.attr(layId)) === -1) {
        $this.remove()
      }
      if (currId !== oprId) {
        element.tabChange(tabsId, oprId)
      }
    })
  }
  $.contextMenu({
    selector: `#${ids.routes_nav_tabs_header}`,
    zIndex: 1001,
    // animation: `{duration: 250, show: 'fadeIn', hide: 'fadeOut'}`,
    events: {
      preShow(...args: any[]) {
        const $this: any = $(args[1].target)
        const isShow = $this.attr('id') !== ids.routes_nav_tabs_header
        if (isShow) {
          selectId = $this.attr(layId) || $this.parent().attr(layId)
          tabNum = $(`#${ids.routes_nav_tabs_header} li`).length
          currId = $(`#${ids.routes_nav_tabs_header} .${cls.this}`).attr(layId)
        }
        return isShow
      },
    },
    items: {
      closeCurr: {
        visible: () => selectId !== '/',
        name: '关闭当前',
        callback() {
          element.tabDelete(tabsId, selectId)
        },
      },
      closeExcludeCurr: {
        visible: () => (tabsId === '/' ? tabNum >= 2 : tabNum >= 3),
        name: '关闭其他',
        callback() {
          removeTabs('curr')
        },
      },
      closeAll: {
        name: '全部关闭',
        visible: () => selectId !== '/',
        callback() {
          removeTabs('all')
        },
      },
      refresh: {
        visible: () => selectId === currId,
        name: '刷新数据',
      },
    },
  })
}
