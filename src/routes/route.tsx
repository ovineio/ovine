import { Spinner } from 'amis'
import { mapTree } from 'amis/lib/utils/helper'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import React, { lazy, Suspense } from 'react'
import { Redirect, Route } from 'react-router-dom'

import logger from '~/utils/logger'
import { getStore } from '~/utils/store'
import { retryPromise } from '~/utils/tool'
import { Amis } from '~/widgets/amis/schema'
import ErrorBoundary from '~/widgets/error_boundary'
import { LayoutLazyFallback } from '~/widgets/layout/loading'

import { limitedRoutesConfig } from './limit'
import { LazyRouteProps } from './types'
import { getPageFilePath, getPagePreset, getRoutePath } from './utils'

const log = logger.getLogger('dev:route')

// TODO: 优化 loading 卡顿
// 方案：提前挂在loading,只是控制显隐藏
const PageSpinner = <Spinner overlay show size="lg" key="pageLoading" />

// 根据 path，pathToComponent  参数 懒加载 `pages/xxx` 组件
export const getPageAsync = (option: LazyRouteProps) => {
  const { nodePath, path = '', pathToComponent } = option

  if (isArray(path)) {
    log.warn('getPageAsync path 必须为字符串', option)
    return
  }

  const filePath = getPageFilePath({ path, pathToComponent })

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
          nodePath,
        }
      }

      const Page: any = isFunction(content) ? content : () => <Amis {...content} />
      return { default: () => <Page {...option} preset={preset} /> }
    })
  )
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

// 懒加载路由，如果 props.component 存在， 则不会懒加载
export const LazyRoute = (props: LazyRouteProps) => {
  const { withSuspense = true, fallback = PageSpinner, path = '', component } = props

  // TODO: 设置 nodePath 默认值
  const routeComponent = (
    <Route
      {...props}
      path={getRoutePath(path)}
      // TODO: 非懒加载组件也要注入权限管理
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

  limitedRoutesConfig.forEach((item) => {
    const { children } = item

    if (!children) {
      return
    }

    mapTree(children, (subItem) => {
      if (subItem.path) {
        routes.push(<LazyRoute key={routes.length + 1} withSuspense={false} {...subItem} />)
      }
      return subItem
    })
  })

  return (
    <ErrorBoundary type="page">
      <Suspense fallback={<LayoutLazyFallback />}>{routes}</Suspense>
    </ErrorBoundary>
  )
}
