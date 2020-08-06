/**
 * APP 路由相关组件
 */

import { Spinner } from 'amis'
import { eachTree } from 'amis/lib/utils/helper'
import { isFunction, map, get, cloneDeep } from 'lodash'
import React, {
  createContext,
  lazy,
  useContext,
  useMemo,
  Suspense,
  useState,
  useEffect,
} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { app } from '@/app'
import NotFound from '@/components/404'
import { Amis } from '@/components/amis/schema'
import ErrorBoundary from '@/components/error_boundary'
import { isSubStr } from '@/utils/tool'

import {
  getNodePath,
  getPageMockSource,
  getPagePreset,
  getRoutePath,
  currPath,
  getPageFileAsync,
} from './exports'
import { checkLimitByKeys } from './limit/exports'
import {
  CheckLimitFunc,
  PresetComponentProps,
  PresetCtxState,
  PresetRouteProps,
  RouteItem,
} from './types'

const PageSpinner = <Spinner overlay show size="lg" key="pageLoading" />

// 根据 path，pathToComponent  参数 懒加载 `pages/xxx` 组件
export const getPageAsync = (option: PresetRouteProps) => {
  return lazy(() =>
    getPageFileAsync(option).then((file: any) => {
      const { default: content = {}, schema } = file

      const compProps: PresetComponentProps = {}
      if (isFunction(content)) {
        compProps.LazyFileComponent = content
      } else {
        content.schema = schema || {}
        compProps.lazyFileAmisProps = content
      }

      return {
        default: () => <PrestComponent {...option} {...compProps} />,
      }
    })
  )
}

// 登录路由拦截
export const PrivateRoute = ({ onAuth, redirect, children, ...rest }: any) => {
  const [isAuth, setAuth] = useState<boolean | null>(null)

  useEffect(() => {
    const authState = isFunction(onAuth) ? onAuth() : true
    if (authState.then) {
      authState.then((res: boolean) => {
        setAuth(res)
      })
    } else {
      setAuth(authState)
    }
  }, [])

  if (isAuth === null) {
    return null
  }

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isAuth) {
          return children
        }
        if (redirect) {
          return (
            <Redirect
              to={{
                pathname: redirect,
                state: { from: location },
              }}
            />
          )
        }
        return <div>unauthorized route.</div>
      }}
    />
  )
}

// usePresetContext 可获取 preset 值，与 checkLimit 校验权限 方法
const PresetContext = createContext<PresetCtxState>({})
export const usePresetContext = () => {
  const preset = useContext(PresetContext)
  const checkLimit: CheckLimitFunc = (keys, option) =>
    checkLimitByKeys(keys, {
      nodePath: preset.nodePath,
      ...option,
    })

  return {
    ...preset,
    checkLimit,
  }
}

// 将 preset 注入组件，可全局通过 usePresetContext 获取 preset 值
const PrestComponent = (props: PresetComponentProps) => {
  const { LazyFileComponent, lazyFileAmisProps, RouteComponent, ...rest } = props
  const { path, pathToComponent, nodePath: propNodePath } = rest

  const preset = useMemo(() => {
    const fileOption = { path, pathToComponent, nodePath: propNodePath }
    const mockSource = !app.env.isMock ? undefined : getPageMockSource(fileOption)
    const nodePath = getNodePath(fileOption)
    const rawPagePreset = getPagePreset(fileOption) || get(lazyFileAmisProps, 'schema.preset')
    const pagePreset = !rawPagePreset ? {} : cloneDeep(rawPagePreset)

    pagePreset.nodePath = nodePath

    map(pagePreset.apis, (api) => {
      // 自动注入规则
      if (api.url && api.mock !== false && !api.mockSource && mockSource) {
        api.mockSource = mockSource[api.url] || mockSource
      }
    })

    return pagePreset
  }, [path, pathToComponent, propNodePath])

  let Component: any = <div>Not Found 请检查路由设置</div>

  if (LazyFileComponent) {
    Component = <LazyFileComponent {...rest} />
  }
  if (RouteComponent) {
    Component = <RouteComponent {...rest} />
  }
  if (lazyFileAmisProps) {
    lazyFileAmisProps.schema.preset = {
      ...lazyFileAmisProps.schema.preset,
      ...preset,
    }
    Component = <Amis {...rest} {...lazyFileAmisProps} />
  }

  return <PresetContext.Provider value={preset}>{Component}</PresetContext.Provider>
}

// 处理每个路由，包裹 PrestComponent 组件
export const PrestRoute = (props: PresetRouteProps) => {
  const {
    component,
    withSuspense = true,
    fallback = PageSpinner,
    path = '',
    exact = true,
    ...rest
  } = props

  const routePath = getRoutePath(path)
  if (exact && !isSubStr(routePath, ':') && routePath !== window.location.pathname) {
    return <Redirect to={app.constants.notFound.route} />
  }
  const RouteComponent = (
    <Route
      {...rest}
      path={routePath}
      exact={exact}
      component={
        !component
          ? getPageAsync(props)
          : () => <PrestComponent {...props} RouteComponent={component} />
      }
    />
  )

  if (withSuspense) {
    return (
      <ErrorBoundary type="page">
        <Suspense fallback={fallback}>{RouteComponent}</Suspense>
      </ErrorBoundary>
    )
  }

  return RouteComponent
}

const NotFoundRoute = () => {
  let Component: any = NotFound
  const notFoundFilePath = app.constants.notFound.pagePath
  if (notFoundFilePath) {
    try {
      Component = lazy(() =>
        getPageFileAsync({
          nodePath: currPath(notFoundFilePath, '404'),
        })
      )
    } catch (_) {
      Component = NotFound
    }
  }
  return <Route path="*" component={Component} />
}

// 将 routeConfig 转换为 route
export const AppMenuRoutes = (props: { authRoutes: RouteItem[] }) => {
  const menuRoutes: any = []

  props.authRoutes.forEach(({ children }) => {
    if (!children) {
      return
    }

    eachTree(children, (item) => {
      if (item.path && !item.limitOnly) {
        menuRoutes.push(<PrestRoute key={menuRoutes.length + 1} {...item} />)
      }
    })
  })

  return (
    <Switch>
      {menuRoutes}
      <NotFoundRoute />
    </Switch>
  )
}
