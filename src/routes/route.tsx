import { Spinner } from 'amis'
import { LinkItem } from 'amis/lib/components/AsideNav'
import { mapTree } from 'amis/lib/utils/helper'
import isFunction from 'lodash/isFunction'
import React, { lazy, Suspense } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { RequestOption } from '~/core/request'
import { getStore } from '~/utils/store'
import { retryPromise } from '~/utils/tool'
import { Amis } from '~/widgets/amis/schema'
import ErrorBoundary from '~/widgets/error_boundary'

import { routesConfig } from './config'

export type Limit = {
  label: string
  icon?: string
  needs?: string[]
  remark?: string
}

export type LimitSchema = {
  limits?: string | string[]
}

export type PagePreset = {
  // 页面所有权限定义
  limits?: Types.ObjectOf<Limit>
  // 页面内所有异步请求
  apis?: Types.ObjectOf<RequestOption & LimitSchema>
}

export type RouteItem = Omit<LinkItem, 'children' | 'component'> &
  Pick<RouteProps, 'component'> & {
    badge?: number
    badgeClassName?: string
    pathToComponent?: boolean | string
    children?: RouteItem[]
    sideVisible?: boolean
  }

type LazyRouteProps = RouteProps & {
  pathToComponent?: boolean | string
  withSuspense?: boolean
  fallback?: any
}

export type PageProps = RouteItem & LazyRouteProps & PagePreset

const PageSpinner = <Spinner overlay show size="lg" key="pageLoading" />

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
        return getStore('isLogin') ? (
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

export const getPageFilePath = (option: Pick<RouteItem, 'path' | 'pathToComponent'>) => {
  const { pathToComponent, path = '' } = option

  const componentPath = typeof pathToComponent === 'string' ? pathToComponent : getRoutePath(path)
  const filePath = componentPath[0] !== '/' ? componentPath : componentPath.substr(1)
  return filePath
}

// 根据 path，pathToComponent  参数 懒加载 `pages/xxx` 组件
export const getPageAsync = (option: LazyRouteProps) => {
  const filePath = getPageFilePath(option)

  return lazy(() =>
    retryPromise(() =>
      import(
        /* webpackInclude: /pages\/.*\/index\.tsx?$/ */
        /* webpackChunkName: "page_[request]" */
        `~/pages/${filePath}`
      )
    ).then((file: any) => {
      const { default: content = {}, schema } = file
      const preset = getPagePreset(filePath) || {}

      if (schema) {
        content.schema = schema
      }

      if (content.schema) {
        content.schema.preset = {
          ...preset,
          ...content.schema.preset,
        }
      }

      const Page: any = isFunction(content) ? content : () => <Amis {...content} />
      return { default: () => <Page {...option} preset={preset} /> }
    })
  )
}

export const getPagePreset = (path: string): PagePreset | undefined => {
  try {
    const limitConf = require(/* webpackInclude: /pages\/.*\/limit\.ts?$/ */
    /* webpackChunkName: "limit_[request]" */
    `~/pages/${path}/preset.ts`)
    return limitConf.default
  } catch (e) {
    //
  }
}

// 懒加载路由，如果 props.component 存在， 则不会懒加载
export const LazyRoute = (props: LazyRouteProps) => {
  const { withSuspense = true, fallback = PageSpinner, path = '', component } = props

  const routeComponent = (
    <Route
      {...props}
      path={getRoutePath(path)}
      component={component ? component : getPageAsync(props)}
    />
  )

  if (withSuspense) {
    return (
      <ErrorBoundary type="page">
        <Suspense fallback={fallback}>{routeComponent}</Suspense>
      </ErrorBoundary>
    )
  }

  return routeComponent
}

// 将 routeConfig 转换为 route
export const AppMenuRoutes = () => {
  const routes: any = []

  routesConfig.forEach((root) => {
    if (!root.children) {
      return
    }

    mapTree(root.children, (item) => {
      if (item.path) {
        routes.push(<LazyRoute key={routes.length + 1} withSuspense={false} {...item} />)
      }
      return item
    })
  })

  return (
    <ErrorBoundary type="page">
      <Suspense fallback={PageSpinner}>{routes}</Suspense>
    </ErrorBoundary>
  )
}
