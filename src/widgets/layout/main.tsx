import React, { useEffect } from 'react'
import { renderRoutes } from 'react-router-config'
import AppHeader from '@widgets/app_header'
import AppSide from '@widgets/app_side'

export default (props: any) => {
  // console.log('layoutProps:', props)
  useEffect(() => {
    layui.use('element')
  }, [])

  return (
    <div>
      <div className="layui-layout layui-layout-admin">
        <AppHeader />
        <AppSide />
        <div className="layui-body">
          <div>{renderRoutes(props.route.routes)}</div>
        </div>
        <div className="layui-footer">2019 © RT-Admin</div>
      </div>
    </div>
  )
}
