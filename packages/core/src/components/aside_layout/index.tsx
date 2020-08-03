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

  useSubscriber<any>([message.asideLayoutCtrl], (msgData = {}) => {
    const { key, toggle } = msgData
    setState((d) => {
      switch (key) {
        case 'toggleAsideScreen':
          d.offScreen = typeof toggle === 'boolean' ? toggle : !d.offScreen
          break
        case 'toggleAsideFold':
          d.asideFolded = typeof toggle === 'boolean' ? toggle : !d.asideFolded
          break
      }
    })
  })

  // 过滤 layout 权限
  const layoutConf: any = useMemo(() => {
    const conf: any = cloneDeep({ header, footer })
    filterSchemaLimit(conf)
    return conf
  }, [header, footer])

  const { AuthRoutes, renderAside } = useMemo(() => {
    setRoutesConfig(routes)
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

  const headerProps = { ...layoutConf.header, ...state, setLayout: setState }

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
        footer={layoutConf.footer && <Amis schema={layoutConf.footer} />}
      >
        <LayoutLoading theme={themeName} />
        {AuthRoutes}
        {children}
      </Layout>
    </StyledLayout>
  )
})
