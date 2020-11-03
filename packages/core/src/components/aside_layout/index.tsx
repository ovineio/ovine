/**
 * App Aside Menu布局
 */

import { Layout } from 'amis'
import { cloneDeep } from 'lodash'
import React, { useEffect, useMemo } from 'react'

import { app } from '@/app'
import { withAppTheme } from '@/app/theme'
import { breakpoints, message, storage } from '@/constants'
import { setRoutesConfig } from '@/routes/config'
import { getAuthRoutes, getAsideMenus } from '@/routes/limit'
import { AppMenuRoutes } from '@/routes/route'
import { useImmer, useSubscriber } from '@/utils/hooks'
import logger from '@/utils/logger'
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

export default withAppTheme<LayoutProps>((props) => {
  const { enableRouteTabs } = useAppContext()

  const { children, theme, routeTabs, api } = props

  const [state, setState] = useImmer<AsideLayoutState>({
    asideFolded: false,
    offScreen: false,
    header: props.header || defaultHeader,
    footer: props.footer,
    routes: props.routes || [],
  })

  const { routes, header, footer, asideFolded, offScreen } = state
  const { ns: themeNs, name: themeName } = theme

  const supportTabs = routeTabs && window.innerWidth >= breakpoints.md && routeTabs.enable !== false
  const withTabs = enableRouteTabs && supportTabs

  const fetchAsideInfo = () => {
    if (!api) {
      return
    }
    app.request<LayoutProps>(api).then((source) => {
      const resData = source?.data

      setState((d) => {
        d.header = resData?.header || defaultHeader
        d.footer = resData?.footer
        // TODO: 校验 routes 的合法性及默认值
        d.routes = resData?.routes || []
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

  useEffect(() => {
    setGlobal(storage.supportRouteTabs, supportTabs)
  }, [supportTabs])

  useEffect(() => {
    fetchAsideInfo()
  }, [])

  useSubscriber<any>(asideLayoutCtrl.msg, (msgData = {}) => {
    const { key, toggle } = msgData
    setState((d) => {
      switch (key) {
        case asideLayoutCtrl.toggleScreen:
          d.offScreen = typeof toggle === 'boolean' ? toggle : !d.offScreen
          break
        case asideLayoutCtrl.toggleFold:
          d.asideFolded = typeof toggle === 'boolean' ? toggle : !d.asideFolded
          break
        case asideLayoutCtrl.fetch:
          fetchAsideInfo()
          break
        default:
      }
    })
  })

  const headerProps = {
    ...layoutConf.header,
    ...state,
    setLayout: setState,
    withRouteTabs: withTabs,
  }

  const routeTabsProps = {
    ...routeTabs,
    themeNs,
    routes: authRoutes,
  }

  const HeaderComponent = (
    <Header {...headerProps} themeNs={themeNs}>
      {withTabs && <RouteTabs {...routeTabsProps} />}
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
