import { AlertComponent, ToastComponent } from 'amis'
import React, { createContext, useContext, useEffect } from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { AppMenuRoutes, PrestRoute, PrivateRoute } from '~/routes/route'
import Layout from '~/widgets/layout'

import { changeAppLang, changeAppTheme } from './constants/msg_key'
import themes from './constants/themes'
import { GlobalAppStyle } from './styled'
import { getAppTheme } from './theme'
import { useImmer, useSubscriber } from './utils/hooks'

type State = {
  theme: string
  lang: string
}
const initState = {
  theme: getAppTheme(),
  lang: 'zh_CN',
}

type AppContext = Omit<State, 'theme'>

const AppContext = createContext<AppContext>(initState)

export const getAppContext = () => useContext(AppContext)

const App = hot(() => {
  const [state, setState] = useImmer<State>(initState)
  const { theme } = state

  useSubscriber([changeAppTheme, changeAppLang], (newValue: string, key) => {
    setState((d) => {
      switch (key) {
        case changeAppTheme:
          d.theme = newValue
          return
        case changeAppLang:
          d.lang = newValue
          return
      }
    })
  })

  return (
    <BrowserRouter>
      <ToastComponent closeButton theme={theme} timeout={1500} className="m-t-xl" />
      <AlertComponent theme={theme} />
      <AppContext.Provider value={state}>
        <ThemeProvider theme={themes[theme]}>
          <GlobalAppStyle />
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
})

export default () => {
  render(<App />, document.getElementById('app-root'))
}
