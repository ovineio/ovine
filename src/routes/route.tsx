import { LinkItem } from 'amis/lib/components/AsideNav'
import { mapTree } from 'amis/lib/utils/helper'
import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { getStorage } from '~/utils/store'

import { routesConfig } from './config'

export type RouteItem = Omit<LinkItem, 'children' | 'component'> &
  Pick<RouteProps, 'component'> & {
    badgeClassName?: string
    children?: RouteItem[]
    getComponent?: any
  }

const contextPath = ''
const pathPrefix = ''

// 计算 路由 path
export const getRoutePath = (path: string[] | string) => {
  return path && path[0] === '/' ? contextPath + path : `${contextPath}${pathPrefix}/${path}`
}

// 登录路由拦截
export const PrivateRoute = ({ children, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return getStorage('isLogin') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}

// 解析 route 配置 计算 需要渲染 组件
export const getRouteComponent = (key: Types.NumStr, item: RouteItem) => {
  const { path, component, getComponent } = item

  const routePath = getRoutePath(path || '')

  if (component) {
    return <Route key={key} path={routePath} component={component} />
  }

  if (getComponent) {
    return <Route key={key} path={routePath} getComponent={getComponent} />
  }
}

// 将 routeConfig 转换为 route
export const renderAppRoutes = () => {
  const routes: any = []

  routesConfig.forEach((root) => {
    if (!root.children) {
      return
    }

    mapTree(root.children, (item) => {
      if (item.path) {
        routes.push(getRouteComponent(routes.length + 1, item))
      }
      return item
    })
  })

  return routes
}
