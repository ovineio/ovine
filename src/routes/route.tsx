import { Spinner } from 'amis'
import { mapTree } from 'amis/lib/utils/helper'
import isFunction from 'lodash/isFunction'
import React, { lazy, Suspense } from 'react'
import { Redirect, Route } from 'react-router-dom'

import { getStore } from '~/utils/store'
import { retryPromise } from '~/utils/tool'
import { Amis } from '~/widgets/amis/schema'
import ErrorBoundary from '~/widgets/error_boundary'
import { LayoutLazyFallback } from '~/widgets/layout/loading'

import { limitedRoutesConfig } from './limit'
import { LazyRouteProps, PagePreset, PresetRouteProps } from './types'
import { getPageFilePath, getPagePreset, getRoutePath } from './utils'

const PageSpinner = <Spinner overlay show size="lg" key="pageLoading" />

// 根据 path，pathToComponent  参数 懒加载 `pages/xxx` 组件
export const getPageAsync = (option: LazyRouteProps & { preset?: PagePreset }) => {
  const { nodePath, path = '', pathToComponent, preset } = option

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
      const pagePreset = preset || getPagePreset(option) || {}

      if (schema) {
        content.schema = schema
      }

      if (content.schema) {
        content.schema.preset = {
          ...pagePreset,
          ...content.schema.preset,
          nodePath,
        }
      }

      const Page: any = isFunction(content) ? content : () => <Amis {...content} />
      return { default: () => <Page {...option} preset={pagePreset} /> }
    })
  )
}

// 获取预设值 组件
const PrestComponnet = (props: PresetRouteProps) => {
  //
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
  const {
    withSuspense = true,
    fallback = PageSpinner,
    path = '',
    component: RouteComponent,
  } = props

  const routePath = getRoutePath(path)
  const preset = getPagePreset(props) || {}

  const renderComponent = (): any => {
    if (!RouteComponent) {
      return <Route {...props} path={routePath} component={getPageAsync(props)} />
    }

    const RoutePresetComponent = (p: any) => <RouteComponent {...p} preset={preset} />

    return <Route {...props} path={routePath} component={RoutePresetComponent} />
  }

  if (withSuspense) {
    return (
      <ErrorBoundary type="page">
        <Suspense fallback={fallback}>{renderComponent()}</Suspense>
      </ErrorBoundary>
    )
  }

  return renderComponent()
}

// 获取预设值
const PrestRoute = (props: PresetRouteProps) => {
  //
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
