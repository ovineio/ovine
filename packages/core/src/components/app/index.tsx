import { AlertComponent, ToastComponent, ContextMenu } from 'amis'
import get from 'lodash/get'
import React, { createContext, useContext, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import { Switch, Route, Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { app } from '@/app'
import { Amis } from '@/components/amis/schema'
import AsideLayout from '@/components/aside_layout'
import { message } from '@/constants'
import { PrestRoute, PrivateRoute } from '@/routes/route'
import GlobalStyle from '@/styled/global'
import { useImmer, useSubscriber } from '@/utils/hooks'
import logger from '@/utils/logger'
import { json2reactFactory } from '@/utils/tool'

type State = {
  theme: string
  lang: string
}

const log = logger.getLogger('lib:components:app')

type AppContext = {
  lang: string
}

const AppContext = createContext<AppContext>({
  lang: 'zh_CN',
})

const j2r = json2reactFactory({
  route: Route,
  'private-route': PrivateRoute,
  'preset-route': PrestRoute,
  'aside-layout': AsideLayout,
  'amis-render': Amis,
})

export const useAppContext = () => useContext(AppContext)

export const App = hot(() => {
  const [state, setState] = useImmer<State>({
    theme: app.theme.getTheme().name,
    lang: 'zh_CN',
  })

  const { theme } = state

  useEffect(() => {
    log.log('App Mounted.')
    const currRoute = app.routerHistory.location.pathname
    const { loginRoute } = app.constants
    // 第一次进入登录页面时 重定向到首页进行 鉴权
    if (loginRoute === currRoute) {
      app.routerHistory.push('/')
    }
    if (app.hook?.onAppMounted) {
      app.hook?.onAppMounted()
    }
  }, [])

  useSubscriber([message.appTheme, message.appLang], (newValue: any, key) => {
    setState((d) => {
      switch (key) {
        case message.appTheme:
          d.theme = newValue
          break
        case message.appLang:
          d.lang = newValue
          break
        default:
      }
    })
  })

  const getTheme = () => {
    const themes = app.theme.getAllThemes()
    const appTheme = themes[theme]
    if (!appTheme) {
      log.warn(`appTheme 不在 主题列表中: ${Object.keys(themes)}, 已经自动设置为 default 主题`)
    }
    return appTheme || get(themes, 'default', {})
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
      <AppContext.Provider value={state}>
        <ThemeProvider theme={getTheme()}>
          <GlobalStyle />
          <Switch>{j2r(app.entry)}</Switch>
        </ThemeProvider>
      </AppContext.Provider>
    </Router>
  )
})
