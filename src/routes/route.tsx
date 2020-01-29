import { LinkItem } from 'amis/lib/components/AsideNav'
import { mapTree } from 'amis/lib/utils/helper'
import isFunction from 'lodash/isFunction'
import React, { lazy, Suspense } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { getStorage } from '~/utils/store'
import { retryPromise } from '~/utils/tool'
import { Schema } from '~/widgets/amis/schema'

import { routesConfig } from './config'

export type RouteItem = Omit<LinkItem, 'children' | 'component'> &
  Pick<RouteProps, 'component'> & {
    badgeClassName?: string
    pathToComponent?: boolean | string
    children?: RouteItem[]
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

export const getPageAsync = (path: string) => {
  return lazy(() =>
    retryPromise(() =>
      import(
        /* webpackInclude: /pages\/.*\/index\.tsx?$/ */
        /* webpackChunkName: "page_[request]" */
        `~/pages/${path}`
      )
    ).then((file: any) => {
      const { default: content = {}, schema } = file

      if (isFunction(content)) {
        return file
      }

      if (schema) {
        content.schema = schema
      }

      return { default: () => <Schema {...content} /> }
    })
  )
}

// 解析 route 配置 计算 需要渲染 组件
export const getRoute = (key: Types.NumStr, item: RouteItem) => {
  const { path = '', component, pathToComponent } = item

  const routeProps = { key, path: getRoutePath(path) }

  if (pathToComponent) {
    const pathComponent = typeof pathToComponent === 'string' ? pathToComponent : path

    return <Route {...routeProps} component={getPageAsync(pathComponent)} />
  }

  if (component) {
    return <Route {...routeProps} component={component} />
  }
}

// 将 routeConfig 转换为 route
export const renderAppMenus = () => {
  const routes: any = []

  routesConfig.forEach((root) => {
    if (!root.children) {
      return
    }

    mapTree(root.children, (item) => {
      if (item.path) {
        routes.push(getRoute(routes.length + 1, item))
      }
      return item
    })
  })

  return <Suspense fallback="loading...">{routes}</Suspense>
}
