/**
 * App Aside Menu布局
 */

import { Layout } from 'amis'
import { cloneDeep } from 'lodash'
import React, { useMemo } from 'react'

import { withAppTheme } from '@/app/theme'
import { message } from '@/constants'
import { setRoutesConfig } from '@/routes/config'
import { getAuthRoutes, getAsideMenus } from '@/routes/limit'
import { AppMenuRoutes } from '@/routes/route'
import { useImmer, useSubscriber } from '@/utils/hooks'
import logger from '@/utils/logger'

import { Amis } from '../amis/schema'
import { filterSchemaLimit } from '../amis/schema/func'
import RouteTabs from '../route_tabs'
import Aside from './aside'
import Header from './header'
import { LayoutLoading, LayoutLazyFallback } from './loading'
import { StyledLayout } from './styled'
import { LayoutState, LayoutProps } from './types'

const initState = {
  asideFolded: false,
  offScreen: false,
}

const log = logger.getLogger('lib:components:asideLayout')

export default withAppTheme<LayoutProps>((props) => {
  const [state, setState] = useImmer<LayoutState>(initState)

  const { header, routes = [], children, footer, theme, withTabs } = props
  const { asideFolded, offScreen } = state

  const { ns: themeNs, name: themeName } = theme

  useSubscriber<any>(message.asideLayoutCtrl, (msgData = {}) => {
    const { key, toggle } = msgData
    setState((d) => {
      switch (key) {
        case 'toggleAsideScreen':
          d.offScreen = typeof toggle === 'boolean' ? toggle : !d.offScreen
          break
        case 'toggleAsideFold':
          d.asideFolded = typeof toggle === 'boolean' ? toggle : !d.asideFolded
          break
        default:
      }
    })
  })

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

  const headerProps = { ...layoutConf.header, ...state, setLayout: setState }

  const HeaderComponent = (
    <Header {...headerProps} themeNs={themeNs}>
      {withTabs && <RouteTabs routes={authRoutes} themeNs={themeNs} />}
    </Header>
  )

  return (
    <StyledLayout id="app-layout">
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
