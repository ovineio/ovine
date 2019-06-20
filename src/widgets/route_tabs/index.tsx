import React, { useEffect } from 'react'

import { cls, filters, ids } from '@constants/layui'

import { changeTab, fireTabChange } from './funcs'
import { StyledRouteTabs } from './styled'

const RouteTabs = () => {
  useEffect(() => {
    layui.use('element', () => {
      const { $, element } = layui
      const $activeNav = $(`#${ids.app_side} .${cls.this}`).find('a')
      fireTabChange({ $, element, $dom: $activeNav, isInit: true })

      element.on(filters.app_side_nav.nav, ($dom: any) => {
        fireTabChange({ $, element, $dom })
      })
      element.on(filters.routes_nav_tabs.tabs, (tabs: any) => {
        changeTab({ $, tabIndex: tabs.index })
      })
    })
  }, [])

  return (
    <StyledRouteTabs id={ids.routes_nav_tabs}>
      <div className="layui-icon rtadmin-tabs-control layui-icon-prev" rtadmin-event="leftPage" />
      <div className="layui-icon rtadmin-tabs-control layui-icon-next" rtadmin-event="rightPage" />
      <div className="layui-tab" lay-allowclose="true" lay-filter={filters.routes_nav_tabs.id}>
        <ul className="layui-tab-title" id={ids.routes_nav_tabs_header}>
          <li className="ripple" lay-id="/">
            <i className="layui-icon layui-icon-home" />
          </li>
        </ul>
      </div>
    </StyledRouteTabs>
  )
}

export default RouteTabs
