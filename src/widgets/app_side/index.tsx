import React from 'react'

import { cls, filters, ids } from '@constants/layui'
import { routesConfig, RouteConfig } from '@routes/config'
import { getHashPath } from '@routes/func'

import { StyledAppSide } from './styled'

const renderLayNavItemChild = (parentRoutes: RouteConfig[], parentPath: string) => {
  return parentRoutes.map((route) => {
    const { title, path, children } = route
    const routePath = `${parentPath}${path}`
    return (
      <dl key={routePath} className="layui-nav-child">
        {!children ? (
          <dd>
            <a
              className="ripple "
              href="javascript:;"
              lay-id={routePath}
              lay-tips={title}
              data-title={title}
            >
              {title}
            </a>
          </dd>
        ) : (
          <>
            <a className="ripple" href="javascript:;" lay-tips={title}>
              {title}
            </a>
            {renderLayNavItemChild(children, routePath)}
          </>
        )}
      </dl>
    )
  })
}

const LayNavItem = routesConfig.map((route: RouteConfig) => {
  const { icon, title, path, children } = route
  return (
    <li key={path} className={`layui-nav-item ${getHashPath() === path ? cls.this : ''}`}>
      {!children ? (
        <a className="ripple" href="javascript:;" lay-tips={title} lay-id={path} data-title={title}>
          {icon && <i className={`layui-icon  layui-icon-${icon}`} />}
          <cite>{title}</cite>
        </a>
      ) : (
        <>
          <a className="ripple" href="javascript:;" lay-tips={title}>
            {icon && <i className={`layui-icon  layui-icon-${icon}`} />}
            <cite>{title}</cite>
          </a>
          {renderLayNavItemChild(children, path)}
        </>
      )}
    </li>
  )
})

export default () => {
  return (
    <StyledAppSide id={ids.app_side} className="layui-side">
      <div className="layui-logo">
        <img src="/static/logo.png" />
        <p>RT-ADMIN</p>
      </div>
      <div className="layui-side-scroll">
        <ul
          className="layui-nav layui-nav-tree"
          lay-shrink="all"
          lay-filter={filters.app_side_nav.id}
        >
          {LayNavItem}
        </ul>
      </div>
    </StyledAppSide>
  )
}
