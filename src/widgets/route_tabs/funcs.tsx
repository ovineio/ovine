import React, { Suspense } from 'react'
import { render } from 'react-dom'

import { progressJs } from '@assets/scripts/progress.js'
import { cls, filters, getLayId, ids, layId } from '@constants/layui'
import { getHashPath, hashRoutes } from '@routes'

const pageTabClass = `${cls.show} fadeInUp`
const tabsId = filters.routes_nav_tabs.id
let progressBar: any

type TabItemType = {
  index: number
  id: string
  title: string
}
export function onTabsInit() {
  layui.use('element', () => {
    const { $, element } = layui

    // 第一次初始化  tabs
    const $initNav = $(`#${ids.app_side} .${cls.this}`).find('a')
    const tabData: TabItemType = {
      id: $initNav.attr(layId),
      title: $initNav.data('title'),
      index: -1,
    }

    fireTabChange({ $, element, tabData })
    changeTab({ $, element, tabData })

    // 点击 左边栏 导航
    element.on(filters.app_side_nav.nav, ($activeNav: any) => {
      tabData.id = $activeNav.attr(layId)
      if (!tabData.id || getHashPath() === tabData.id) {
        return
      }
      tabData.title = $activeNav.data('title')
      tabData.index = -1
      fireTabChange({ $, element, tabData })
    })

    // tabs 增加/删除/切换都调用该方法 且 参数一致
    element.on(filters.routes_nav_tabs.tabs, (tabs: any) => {
      tabData.index = tabs.index
      changeTab({ $, element, tabData })
    })
  })
}

function fireTabChange({ $, element, tabData }: ChangeTabOption) {
  const { title, id } = tabData

  const isTabExist = $(`#${ids.routes_nav_tabs_header} li${getLayId(id, true)}`).length
  if (!isTabExist) {
    element.tabAdd(tabsId, { title, id })
  }
  element.tabChange(tabsId, id)
}

type ChangeTabOption = {
  $: any
  element: any
  tabData: TabItemType
}
export const changeTab = ({ $, tabData }: ChangeTabOption) => {
  const { index, id } = tabData
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

  if (!progressBar) {
    progressBar = progressJs()
      .start()
      .autoIncrease(20, 500)
    setTimeout(() => {
      progressJs().end()
      progressBar = undefined
    }, 1000)
  }

  const PageComponent = hashRoutes[pathName]
  render(
    <Suspense fallback="">
      <PageComponent />
    </Suspense>,
    $tabsContent.find(tabsContentSelector)[0]
  )
}
