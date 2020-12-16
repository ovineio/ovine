/**
 * APP 路由相关组件
 * 优化： 由于route读取数据时，会有短暂的 404
 * BUG: 页面切换太快时，会导致页面报错
 * Uncaught (in promise) Error: [mobx-state-tree] Cannot modify 'ErrorDetail[]@/errorData [dead]', the object is protected and can only be modified by using an action.
 */

import { Spinner } from 'amis'
import { eachTree } from 'amis/lib/utils/helper'
import { isFunction, map, get, cloneDeep, omit } from 'lodash'
import React, {
  createContext,
  lazy,
  useContext,
  useMemo,
  Suspense,
  useState,
  useEffect,
  isValidElement,
  useRef,
} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { app } from '@/app'
import NotFound from '@/components/404'
import { Amis } from '@/components/amis/schema'
import { useDebounceRender } from '@/components/debounce_render'
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
  PrivateRouteProps,
  RouteItem,
} from './types'

const PageSpinner = <Spinner overlay show size="lg" key="pageLoading" />

// 根据 path，pathToComponent  参数 懒加载 `pages/xxx` 组件
export const getPageAsync = (option: PresetRouteProps) => {
  return lazy(() =>
    getPageFileAsync(option).then((file: any) => {
      const { default: content = {}, schema, getSchema } = file

      const compProps: PresetComponentProps = {}
      if (isFunction(content)) {
        compProps.LazyFileComponent = content
      } else {
        content.schema = isFunction(getSchema) ? getSchema(option) : schema || {}
        compProps.lazyFileAmisProps = content
      }

      return {
        default: () => <PrestComponent {...option} {...compProps} />,
      }
    })
  )
}

// 登录路由拦截
export const PrivateRoute = (props: PrivateRouteProps) => {
  const { onAuth, onRedirect, redirect, children, ...rest } = props
  const [isAuth, setAuth] = useState<boolean | null>(null)

  const redirectPath = (onRedirect ? onRedirect() : redirect) || app.constants.loginRoute

  useEffect(() => {
    const authState: any = isFunction(onAuth) ? onAuth() : true

    if (typeof authState === 'boolean') {
      setAuth(authState)
    } else if (authState.then) {
      authState.then((res: boolean) => {
        setAuth(res)
      })
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
        if (redirectPath) {
          return (
            <Redirect
              to={{
                pathname: redirectPath,
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
const PresetContext = createContext<PresetCtxState>({
  route: {},
})
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
  const { path, exact, children, pathToComponent, nodePath: propNodePath } = rest

  const preset = useMemo(() => {
    const fileOption = { path, pathToComponent, nodePath: propNodePath }
    const mockSource = !app.env.isMock ? undefined : getPageMockSource(fileOption)
    const nodePath = getNodePath(fileOption)
    const rawPagePreset = getPagePreset(fileOption) || get(lazyFileAmisProps, 'schema.preset')
    const pagePreset = !rawPagePreset ? {} : cloneDeep(rawPagePreset)

    pagePreset.nodePath = exact && children && path ? path : nodePath

    map(pagePreset.apis, (api) => {
      // 自动注入规则
      if (api.url && api.mock !== false && !api.mockSource && mockSource) {
        api.mockSource = mockSource[api.url] || mockSource
      }
    })

    return pagePreset
  }, [path, pathToComponent, propNodePath])

  const contextValue = {
    ...preset,
    route: omit(rest, Object.keys(preset)),
  }
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

  return <PresetContext.Provider value={contextValue}>{Component}</PresetContext.Provider>
}

// 处理每个路由，包裹 PrestComponent 组件
export const PrestRoute = (props: PresetRouteProps) => {
  const {
    component,
    children,
    withSuspense = true,
    fallback = PageSpinner,
    path = '',
    exact = true,
    debounceRoute = 0,
    ...rest
  } = props

  const routePath = getRoutePath(path)
  const locationKey = rest?.location?.key || ''
  const keyRef = useRef('')
  if (locationKey) {
    keyRef.current = locationKey
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
    >
      {isValidElement(children) ? children : null}
    </Route>
  )

  const getRouteComponent = () => {
    if (exact && !isSubStr(routePath, ':') && routePath !== window.location.pathname) {
      return <Redirect to={app.constants.notFound.route} />
    }

    if (withSuspense) {
      return (
        <ErrorBoundary type="page">
          <Suspense fallback={fallback}>{RouteComponent}</Suspense>
        </ErrorBoundary>
      )
    }
    return RouteComponent
  }

  // TODO: 在 qiankun 中， 每次点击路由切换会，刷新强制触发页面，两次更新。在飞 qiankun 页面下，没问题。
  // 该解决方案会导致页面切换时会闪一下
  const CachedRoute = useDebounceRender(
    {
      getComponent: getRouteComponent,
      wait: debounceRoute,
    },
    [keyRef.current]
  )

  return debounceRoute ? CachedRoute : getRouteComponent()
}

// TODO: 支持自定义 404
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

type AppMenuRoutesProps = {
  authRoutes: RouteItem[]
  fallback: any
  // eslint-disable-next-line
  debounceRoute?: number
}

// 将 routeConfig 转换为 route
export const AppMenuRoutes = (props: AppMenuRoutesProps) => {
  const menuRoutes: any = []

  const { debounceRoute, authRoutes, fallback: FallBack } = props

  // eslint-disable-next-line
  eachTree(authRoutes, (item: RouteItem) => {
    const { path, limitOnly } = item
    if (path && !limitOnly) {
      const routeProps = {
        key: menuRoutes.length + 1,
        fallback: <FallBack />,
        debounceRoute,
        ...item,
      }
      menuRoutes.push(<PrestRoute {...routeProps} />)
    }
  })

  return (
    <Switch>
      {menuRoutes}
      <NotFoundRoute />
    </Switch>
  )
}
