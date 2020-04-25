/**
 * App Aside Menu布局
 */

import { Layout } from 'amis'
import { cloneDeep } from 'lodash'
import React, { useMemo } from 'react'

import { withAppTheme } from '@/app/theme'
import { setRoutesConfig } from '@/routes/config'
import { getAuthRoutes, getAsideMenus, getLimitMenus } from '@/routes/limit'
import { AppMenuRoutes } from '@/routes/route'
import { useImmer } from '@/utils/hooks'

import logger from '@/utils/logger'

import { Amis } from '../amis/schema'
import Aside from './aside'
import Header from './header'
import { LayoutLoading } from './loading'
import { StyledLayout } from './styled'
import { LayoutState, LayoutProps } from './types'

const initState = {
  asideFolded: false,
  offScreen: false,
}

const log = logger.getLogger('lib:components:asideLayout')
export default withAppTheme<LayoutProps>((props) => {
  const [state, setState] = useImmer<LayoutState>(initState)

  const { header, routes = [], children, footer, theme } = props
  const { asideFolded, offScreen } = state

  const { ns: themeNs, name: themeName } = theme
  const headerProps = { ...header, ...state, setLayout: setState }

  const { AuthRoutes, renderAside } = useMemo(() => {
    setRoutesConfig(cloneDeep(routes))
    getLimitMenus()
    const configs = {
      authRoutes: getAuthRoutes(),
      asideMenus: getAsideMenus(),
    }
    log.log('routeConfig', configs)
    return {
      renderAside: (t: string) => <Aside theme={t} asideMenus={configs.asideMenus} />,
      AuthRoutes: <AppMenuRoutes authRoutes={configs.authRoutes} />,
    }
  }, [routes])

  return (
    <StyledLayout>
      <Layout
        headerFixed
        contentClassName="app-layout-body"
        theme={themeName}
        folded={asideFolded}
        offScreen={offScreen}
        header={<Header {...headerProps} themeNs={themeNs} />}
        aside={renderAside(themeName)}
        footer={footer && <Amis schema={footer} />}
      >
        <LayoutLoading theme={themeName} />
        {AuthRoutes}
        {children}
      </Layout>
    </StyledLayout>
  )
})
