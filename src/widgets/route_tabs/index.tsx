import React, { useEffect } from 'react'

import { filters, ids } from '@constants/layui'

import { onTabsInit } from './funcs'
import { StyledRouteTabs } from './styled'

const RouteTabs = () => {
  useEffect(onTabsInit, [])

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
