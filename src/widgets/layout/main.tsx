import React, { useEffect } from 'react'
import { renderRoutes } from 'react-router-config'
import AppHeader from '@widgets/app_header'
import AppSide from '@widgets/app_side'
import RouteTabs from '@widgets/route_tabs'
import { ids } from '@constants/layui'
import { StyledLayout } from './styled'

export default (props: any) => {
  useEffect(() => {
    layui.use('element')
  }, [])

  return (
    <StyledLayout className="layui-layout layui-layout-admin">
      <AppHeader />
      <AppSide />
      <RouteTabs link={(path: string) => props.history.push(path)} />
      <div className="layui-body" id={ids.app_body}>
        {renderRoutes(props.route.routes)}
      </div>
    </StyledLayout>
  )
}
