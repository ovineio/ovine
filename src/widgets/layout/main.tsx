import React, { useEffect } from 'react'

import { ids } from '@constants/layui'
import AppHeader from '@widgets/app_header'
import AppSide from '@widgets/app_side'
import RouteTabs from '@widgets/route_tabs'

import { StyledLayout } from './styled'

const MainLayout = () => {
  useEffect(() => {
    layui.use('element')
  }, [])

  return (
    <StyledLayout className="layui-layout layui-layout-admin">
      <AppHeader />
      <AppSide />
      <RouteTabs />
      <div className="layui-body" id={ids.app_body} />
    </StyledLayout>
  )
}

export default MainLayout
