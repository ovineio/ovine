import React, { useEffect, Suspense } from 'react'
import { render } from 'react-dom'

import { cls, filters, getLayId, ids, layId } from '@constants/layui'
import { hashRoutes } from '@routes/index'

import { StyledRouteTabs } from './styled'

const pageTabClass = `${cls.show} fadeInUp`

const changeTab = ({ $, tabIndex }: any) => {
  const pathName = $(`#${ids.routes_nav_tabs_header} li`)
    .eq(tabIndex)
    .attr(layId)

  $(`#${ids.app_body} .${cls.app_tabs_items}${getLayId(pathName, true)}`)
    .addClass(pageTabClass)
    .siblings()
    .removeClass(pageTabClass)

  location.hash = pathName
}

const fireTabChange = ({ element, $, $dom }: any) => {
  const pathName = $dom.attr(layId)
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

  $tabsContent.find(`.${cls.show}`).removeClass(pageTabClass)
  $tabsContent.append(
    `<div class="animated fast ${cls.app_tabs_items} ${pageTabClass}" ${layIdStr}></div>`
  )

  // location.hash = pathName
  const PageComponent = hashRoutes[pathName]
  render(
    <Suspense fallback="">
      <PageComponent />
    </Suspense>,
    $tabsContent.find(tabsContentSelector)[0]
  )
  element.tabChange(filters.routes_nav_tabs.id, pathName)
}

const RouteTabs = () => {
  useEffect(() => {
    layui.use('element', () => {
      const { $, element } = layui
      fireTabChange({ $, element, $dom: $(`#${ids.app_side} .${cls.this}`).find('a') })

      element.on(filters.app_side_nav.nav, ($dom: any) => {
        fireTabChange({ $, element, $dom })
      })
      element.on(filters.routes_nav_tabs.tabs, ($dom: any) => {
        changeTab({ $, tabIndex: $dom.index })
      })
    })
  }, [])

  return (
    <StyledRouteTabs id={ids.routes_nav_tabs}>
      <div className="layui-icon rtadmin-tabs-control layui-icon-prev" rtadmin-event="leftPage" />
      <div className="layui-icon rtadmin-tabs-control layui-icon-next" rtadmin-event="rightPage" />
      <div className="layui-tab" lay-allowclose="true" lay-filter={filters.routes_nav_tabs.id}>
        <ul className="layui-tab-title" id={ids.routes_nav_tabs_header}>
          <li lay-id="/">
            <i className="layui-icon layui-icon-home" />
          </li>
        </ul>
      </div>
    </StyledRouteTabs>
  )
}

export default RouteTabs
