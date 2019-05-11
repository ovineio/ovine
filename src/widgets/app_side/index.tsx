import React from 'react'
import routesConfig, { RouteConfig } from '@routes/config'
import { filters, ids } from '@constants/layui'
import { StyledAppSide } from './styled'

const renderLayNavItemChild = (parentRoutes: RouteConfig[], parentPath: string) => {
  return parentRoutes.map((route) => {
    const { title, path, routes } = route
    const routePath = `${parentPath}${path}`
    return (
      <dl className="layui-nav-child">
        {!routes ? (
          <dd>
            <a
              className={`layui-nav-item layui-nav-itemed ${
                location.pathname === routePath ? 'layui-this' : ''
              }`}
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
            <a href="javascript:;" lay-tips={title}>
              {title}
            </a>
            {renderLayNavItemChild(routes, routePath)}
          </>
        )}
      </dl>
    )
  })
}

const LayNavItem = routesConfig.map((route: RouteConfig) => {
  const { icon, title, path, routes } = route
  return (
    <li
      key={path}
      className={`layui-nav-item layui-nav-itemed ${
        location.pathname === path ? 'layui-this' : ''
      }`}
    >
      {!routes ? (
        <a href="javascript:;" lay-tips={title} lay-id={path} data-title={title}>
          {icon && <i className="layui-icon layui-icon-home" />}
          <cite>{title}</cite>
        </a>
      ) : (
        <>
          <a href="javascript:;" lay-tips={title}>
            {icon && <i className="layui-icon layui-icon-home" />}
            <cite>{title}</cite>
          </a>
          {renderLayNavItemChild(routes, path)}
        </>
      )}
    </li>
  )
})

export default () => {
  return (
    <StyledAppSide id={ids.app_side} className="layui-side layui-bg-black">
      <div className="layui-logo">
        <img src="/static/logo.png" />
        <p>RT-ADMIN</p>
      </div>
      <div className="layui-side-scroll">
        <ul className="layui-nav layui-nav-tree" lay-filter={filters.app_side_nav.id}>
          {LayNavItem}
        </ul>
      </div>
    </StyledAppSide>
  )
}
