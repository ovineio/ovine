/**
 * App Aside Menu布局
 * TODO: 添加 RouteTab/Aside/Header 的默认 loading 状态
 */

import { Layout } from 'amis'
import { cloneDeep } from 'lodash'
import React, { useEffect, useMemo } from 'react'

import { RouteChildrenProps } from 'react-router-dom'

import { app } from '@/app'
import { withAppTheme } from '@/app/theme'
import { breakpoints, message, storage } from '@/constants'
import { setRoutesConfig } from '@/routes/config'
import { getAuthRoutes, getAsideMenus } from '@/routes/limit'
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

export default withAppTheme<RouteChildrenProps & LayoutProps>((props) => {
  const { enableRouteTabs } = useAppContext()

  const { children, theme, api, location } = props

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

  const supportTabs = routeTabs && window.innerWidth >= breakpoints.md && routeTabs.enable !== false
  const withTabs = enableRouteTabs && supportTabs

  const requestLayoutApi = (data?: any) => {
    if (!api) {
      return
    }
    if (data) {
      api.data = {
        ...api.data,
        ...data,
      }
    }

    app.request<LayoutProps>(api).then((source) => {
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

  const { authRoutes, AuthRoutes, renderAside } = useMemo(() => {
    setRoutesConfig(routes)
    const configs = {
      authRoutes: getAuthRoutes(),
      asideMenus: getAsideMenus(),
    }
    log.log('routeConfig', configs)
    return {
      authRoutes: configs.authRoutes,
      renderAside: (t: string) => <Aside theme={t} asideMenus={configs.asideMenus} />,
      AuthRoutes: <AppMenuRoutes fallback={LayoutLazyFallback} authRoutes={configs.authRoutes} />,
    }
  }, [routes])

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
      // 防止首次进入页面 首页直接刷新两次
      if (supportTabs) {
        publish(message.clearRouteTabs, { refreshRoot: false })
      } else if (location.pathname !== rootRoute) {
        app.routerHistory.push(rootRoute)
      }
    }
  }, [AuthRoutes, resetRoute])

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
      {withTabs && routes.length && <RouteTabs {...routeTabsProps} />}
    </Header>
  )

  return (
    <StyledLayout id="app-layout" className={withTabs ? 'with-route-tabs' : ''}>
      <Layout
        headerFixed
        theme={themeName}
        folded={asideFolded}
        offScreen={offScreen}
        header={HeaderComponent}
        aside={renderAside(themeName)}
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
