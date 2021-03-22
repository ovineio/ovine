/**
 * TODO: 兼容移动端
 */

import { flattenTree } from 'amis/lib/utils/helper'
import React, { useMemo } from 'react'

import { Amis } from '@core/components/amis/schema'
import { setRoutesConfig } from '@core/routes/config'
import { getAuthRoutes, getAsideMenus, clearRouteStore } from '@core/routes/limit'
import { AppMenuRoutes } from '@core/routes/route'

import { prdPathPrefix } from '~/app/constants'
import { itemUserSchema } from '~/app/layout/item_user'

import Nav from './nav'
import { PrdLayout } from './styled'

export default (props) => {
  const { children, routes } = props

  const { AuthRoutes, asideMenus = [] } = useMemo(() => {
    clearRouteStore()
    setRoutesConfig(routes)
    const configs = {
      authRoutes: getAuthRoutes(),
      asideMenus: flattenTree(getAsideMenus())
        .filter((i) => !!i.path)
        .map((i) => {
          i.path = `${prdPathPrefix}${i.path}`
          return i
        }),
    }

    return {
      ...configs,
      AuthRoutes: (
        <AppMenuRoutes
          pathPrefix={prdPathPrefix}
          fallback="loading..."
          authRoutes={configs.authRoutes}
        />
      ),
    }
  }, [routes])

  return (
    <PrdLayout className="p-b-xs">
      <nav className="navbar navbar-expand-lg padder-md navbar-light b-a">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <a className="navbar-brand" href="#">
          <a className="navbar-brand" href="#">
            <img
              className="d-inline-block align-top m-r-sm"
              src="https://ovine.igroupes.com/demo/static/images/logo_line_white.png"
              alt="LOGO"
              loading="lazy"
            />
            <span>Ovine 数据管理</span>
          </a>
        </a>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <Nav menus={asideMenus} />
          <div className="user-item nav-item m-r-sm">
            <Amis schema={itemUserSchema} />
          </div>
        </div>
      </nav>
      <div className="content m-md b-a r-2x">
        {AuthRoutes}
        {children}
      </div>
    </PrdLayout>
  )
}
