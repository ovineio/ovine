/**
 * App Aside Menu布局
 * TODO: 添加 RouteTab/Aside/Header 的默认 loading 状态
 * 1. 动态页面 loading 明显，可能与 table loading 状态同步。
 */

import { Layout } from 'amis'
import { cloneDeep } from 'lodash'
import React, { useEffect, useMemo } from 'react'

import { RouteChildrenProps } from 'react-router-dom'

import { app } from '@/app'
import { withAppTheme } from '@/app/theme'
import { breakpoints, message, storage } from '@/constants'
import { setRoutesConfig } from '@/routes/config'
import { getCurrRoutePath } from '@/routes/exports'
import { getAuthRoutes, getAsideMenus, clearRouteStore } from '@/routes/limit'
import { AppMenuRoutes } from '@/routes/route'
import { useImmer, useSubscriber } from '@/utils/hooks'
import logger from '@/utils/logger'
import { publish } from '@/utils/message'
import { setGlobal } from '@/utils/store'

import { Amis } from '../amis/schema'
import { filterSchemaLimit } from '../amis/schema/func'
import { useAppContext } from '../app/context'
import RouteTabs from '../route_tabs'
import Aside from './aside'
import Header from './header'
import { LayoutLoading, LayoutLazyFallback } from './loading'
import { StyledLayout } from './styled'
import { AsideLayoutState, LayoutProps } from './types'

const log = logger.getLogger('lib:components:asideLayout')

const { asideLayoutCtrl } = message

const defaultHeader = {
  brand: {
    logo: '',
    title: '',
  },
}

// TODO: 获取APi路由时有 短暂的 404 页面，需要改成loading 状态
export default withAppTheme<RouteChildrenProps & LayoutProps>((props) => {
  const { enableRouteTabs } = useAppContext()
  const { children, theme, api, debounceRoute } = props

  const [state, setState] = useImmer<AsideLayoutState>({
    asideFolded: false,
    offScreen: false,
    resetRoute: props.resetRoute,
    rootRoute: props.rootRoute || '/',
    routeTabs: props.routeTabs || {},
    header: props.header || defaultHeader,
    footer: props.footer,
    routes: props.routes || [],
  })

  const { routes, header, routeTabs, footer, asideFolded, rootRoute, resetRoute, offScreen } = state
  const { ns: themeNs, name: themeName } = theme

  // TODO: 使用 styled media 来检查 媒体查询
  const supportTabs = routeTabs && window.innerWidth >= breakpoints.md && routeTabs.enable !== false
  const withTabs = enableRouteTabs && supportTabs

  const requestLayoutApi = (data?: any) => {
    if (!api) {
      return
    }
    const reqOpt = {
      ...api,
      data: {
        ...api.data,
        ...data,
      },
    }
    app.request<LayoutProps>(reqOpt).then((source) => {
      const resData = source?.data || {}

      setState((d) => {
        d.resetRoute = !!resData.resetRoute
        if (resData.header) {
          d.header = resData.header || defaultHeader
        }
        if (resData.rootRoute) {
          d.rootRoute = resData.rootRoute
        }
        if (resData.routeTabs) {
          d.routeTabs = resData.routeTabs
        }
        if (resData.footer) {
          d.footer = resData.footer
        }
        // TODO: 校验 routes 的合法性及默认值
        if (resData.routes) {
          d.routes = resData.routes
        }
      })
    })
  }

  // 过滤 layout 权限
  const layoutConf: any = useMemo(() => {
    const conf: any = cloneDeep({ header, footer })
    filterSchemaLimit(conf)
    return conf
  }, [header, footer])

  const { authRoutes, AuthRoutes, asideMenus } = useMemo(() => {
    clearRouteStore()
    setRoutesConfig(routes)
    const configs = {
      authRoutes: getAuthRoutes(),
      asideMenus: getAsideMenus(),
    }
    log.log('routeConfig', configs)
    return {
      ...configs,
      // renderAside: (t: string) => <Aside theme={t} asideMenus={configs.asideMenus} />,
      AuthRoutes: (
        <AppMenuRoutes
          debounceRoute={debounceRoute}
          fallback={LayoutLazyFallback}
          authRoutes={configs.authRoutes}
        />
      ),
    }
  }, [routes])

  const LayoutAside = useMemo(() => {
    return <Aside theme={themeName} asideMenus={asideMenus} />
  }, [themeName, routes])

  useSubscriber<any>(asideLayoutCtrl.msg, (msgData = {}) => {
    const { key, toggle, data } = msgData
    setState((d) => {
      switch (key) {
        case asideLayoutCtrl.toggleScreen:
          d.offScreen = typeof toggle === 'boolean' ? toggle : !d.offScreen
          break
        case asideLayoutCtrl.toggleFold:
          d.asideFolded = typeof toggle === 'boolean' ? toggle : !d.asideFolded
          break
        case asideLayoutCtrl.reload:
          requestLayoutApi(data)
          break
        default:
      }
    })
  })

  useEffect(() => {
    requestLayoutApi()
  }, [])

  useEffect(() => {
    setGlobal(storage.supportRouteTabs, supportTabs)
  }, [supportTabs])

  useEffect(() => {
    if (resetRoute) {
      const refreshRoot = getCurrRoutePath() !== rootRoute
      // 防止首次进入页面 首页直接刷新两次
      if (supportTabs) {
        publish(message.clearRouteTabs, { refreshRoot })
      } else if (refreshRoot) {
        app.routerHistory.push(rootRoute)
      }
    }
  }, [AuthRoutes, rootRoute, resetRoute])

  const headerProps = {
    ...layoutConf.header,
    ...state,
    setLayout: setState,
    withRouteTabs: withTabs,
  }

  const routeTabsProps = {
    ...routeTabs,
    rootRoute,
    themeNs,
    routes: authRoutes,
  }

  const HeaderComponent = (
    <Header {...headerProps} themeNs={themeNs}>
      {withTabs && !!routes.length && <RouteTabs {...routeTabsProps} />}
    </Header>
  )

  // TODO: 切换  route 时，默认渲染了 404 页面，需要天添加 loading

  return (
    <StyledLayout id="app-layout" className={withTabs ? 'with-route-tabs' : ''}>
      <Layout
        headerFixed
        theme={themeName}
        folded={asideFolded}
        offScreen={offScreen}
        header={HeaderComponent}
        aside={LayoutAside}
        footer={layoutConf.footer && <Amis schema={layoutConf.footer} />}
      >
        <div className="app-layout-body">
          <LayoutLoading theme={themeName} />
          {AuthRoutes}
          {children}
        </div>
      </Layout>
    </StyledLayout>
  )
})
