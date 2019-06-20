import React, { Suspense } from 'react'
import { render } from 'react-dom'

import { progressJs } from '@assets/scripts/progress.js'
import { cls, filters, getLayId, ids, layId } from '@constants/layui'
import { hashRoutes } from '@routes'

const pageTabClass = `${cls.show} fadeInUp`

export const changeTab = ({ $, tabIndex, pathName }: any) => {
  const $tab = $(`#${ids.routes_nav_tabs_header} li`).eq(tabIndex)
  const pathNameStr = pathName ? pathName : $tab.attr(layId)

  // if (!$tab.hasClass('ripple')) {
  //   $tab.addClass('ripple')
  // }

  if (!pathNameStr) {
    return
  }

  progressJs()
    .start()
    .autoIncrease(20, 500)
  setTimeout(() => {
    progressJs().end()
  }, 1000)

  $(`#${ids.app_body} .${cls.app_tabs_items}${getLayId(pathNameStr, true)}`)
    .addClass(pageTabClass)
    .siblings()
    .removeClass(pageTabClass)

  location.hash = pathNameStr
}

export const fireTabChange = ({ element, $, $dom, isInit }: any) => {
  const pathName = $dom.attr(layId)

  if (!pathName) {
    return
  }

  const layIdStr = getLayId(pathName)
  const $tabsContent: any = $(`#${ids.app_body}`)
  const tabsContentSelector = `.${cls.app_tabs_items}[${layIdStr}]`
  const isTabExist = $tabsContent.find(tabsContentSelector).length

  if (isTabExist) {
    element.tabChange(filters.routes_nav_tabs.id, pathName)
    return
  }

  if (pathName !== '/') {
    element.tabAdd(filters.routes_nav_tabs.id, {
      id: pathName,
      title: $dom.attr('data-title'),
    })
  }

  // $tabsContent.find(`.${cls.show}`).removeClass(pageTabClass)
  $tabsContent.append(`<div class="animated fast ${cls.app_tabs_items}" ${layIdStr}></div>`)
  element.tabChange(filters.routes_nav_tabs.id, pathName)

  if (isInit) {
    changeTab({ $, element, pathName })
  }

  const PageComponent = hashRoutes[pathName]
  render(
    <Suspense fallback="">
      <PageComponent />
    </Suspense>,
    $tabsContent.find(tabsContentSelector)[0]
  )
}
