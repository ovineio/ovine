import { AlertComponent, ToastComponent, ContextMenu } from 'amis'
import get from 'lodash/get'
import React, { useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import { Switch, Route, Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { app } from '@/app'
import { Amis } from '@/components/amis/schema'
import AsideLayout from '@/components/aside_layout'
import BactTop from '@/components/back_top'
import { message, rootRoute, storage } from '@/constants'
import { PrestRoute, PrivateRoute } from '@/routes/route'
import GlobalStyle from '@/styled/global'
import { useImmer, useSubscriber } from '@/utils/hooks'
import logger from '@/utils/logger'
import { unsubscribeAll } from '@/utils/message'
import { getStore } from '@/utils/store'
import { json2reactFactory } from '@/utils/tool'

import { AppContext, AppContextState } from './context'

const log = logger.getLogger('lib:components:app')

export type State = Omit<AppContextState, 'setContext'> & {
  theme: string
}

const j2r = json2reactFactory({
  route: Route,
  'switch-route': Switch,
  'private-route': PrivateRoute,
  'preset-route': PrestRoute,
  'aside-layout': AsideLayout,
  'amis-render': Amis,
})

const cacheRouteTabs = getStore<boolean>(storage.enableRouteTabs)

const AppComponent = () => {
  const [state, setState] = useImmer<State>({
    locale: getStore(storage.appLocale) || app.amis.locale || 'zh-CN',
    enableRouteTabs: cacheRouteTabs === null ? true : cacheRouteTabs,
    theme: app.theme.getTheme().name,
  })

  const { theme } = state

  const contextState = { ...state, setContext: setState as any }

  useEffect(() => {
    log.log('App Mounted.')
    const currRoute = app.routerHistory.location.pathname
    const { loginRoute } = app.constants

    // 第一次进入登录页面时 重定向到首页进行 鉴权
    if (loginRoute === currRoute) {
      app.routerHistory.replace(rootRoute)
    }

    const onAppMounted = app.hook?.onAppMounted
    if (onAppMounted) {
      onAppMounted()
    }

    return () => {
      if (!process.env.HOT) {
        unsubscribeAll()
      }
    }
  }, [])

  useSubscriber([message.appTheme, message.appLocale], (newValue: any, key) => {
    setState((d) => {
      switch (key) {
        case message.appTheme:
          d.theme = newValue
          break
        case message.appLocale:
          d.locale = newValue
          break
        default:
      }
    })
  })

  const getTheme = () => {
    const themes = app.theme.getAllThemes()
    const appTheme = themes[theme]
    if (!appTheme) {
      log.warn(
        `appTheme: ${theme} 不在 主题列表中: ${Object.keys(themes)}, 已经自动设置为 cxd 主题`
      )
    }
    return appTheme || get(themes, 'cxd', {})
  }

  return (
    <Router history={app.routerHistory}>
      <ToastComponent
        closeButton
        theme={theme}
        timeout={app.constants.toastDuration}
        className="m-t-xl"
      />
      <AlertComponent theme={theme} />
      <ContextMenu theme={theme} />
      {app.constants.enableBackTop && <BactTop />}
      <AppContext.Provider value={contextState}>
        <ThemeProvider theme={getTheme()}>
          <GlobalStyle />
          <Switch>{j2r(app.entry)}</Switch>
        </ThemeProvider>
      </AppContext.Provider>
    </Router>
  )
}

export const App = hot(AppComponent)
