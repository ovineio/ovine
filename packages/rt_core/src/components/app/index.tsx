
import { AlertComponent, ToastComponent } from 'amis'
import React, { createContext, useContext } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import Layout from '@/components/layout'
import { message } from '@/constants'
import { AppMenuRoutes, PrestRoute, PrivateRoute } from '@/routes/route'
import { useImmer, useSubscriber } from '@/utils/hooks'
import GlobalStyle from '@/styles/styled/global'
import { getTheme, getAllThemes } from '@/styles/styled/exports'

type State = {
  theme: string
  lang: string
}
const initState = {
  theme: getTheme().name,
  lang: 'zh_CN',
}

type AppContext = Omit<State, 'theme'>

const AppContext = createContext<AppContext>(initState)

export const useAppContext = () => useContext(AppContext)

export const App = () => {
  const [state, setState] = useImmer<State>(initState)
  const { theme } = state

  useSubscriber([message.appTheme, message.appLang], (newValue: string, key) => {
    setState((d) => {
      switch (key) {
        case message.appTheme:
          d.theme = newValue
          break
        case message.appLang:
          d.lang = newValue
          break
      }
    })
  })

  return (
    <BrowserRouter>
      <ToastComponent closeButton theme={theme} timeout={1500} className="m-t-xl" />
      <AlertComponent theme={theme} />
      <AppContext.Provider value={state}>
        <ThemeProvider theme={getAllThemes()[theme]}>
          <GlobalStyle />
          <Switch>
            <PrestRoute pathToComponent path="/login" />
            <PrivateRoute path="/">
              <Layout>
                <AppMenuRoutes />
              </Layout>
            </PrivateRoute>
          </Switch>
        </ThemeProvider>
      </AppContext.Provider>
    </BrowserRouter>
  )
}
