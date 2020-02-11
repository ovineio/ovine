import { AlertComponent, ToastComponent } from 'amis'
import React, { createContext, useContext } from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { withTheme, DefaultTheme, ThemeProvider } from 'styled-components'

import NotMatch from '~/pages/404'
import { AppMenuRoutes, PrestRoute, PrivateRoute } from '~/routes/route'
import Layout from '~/widgets/layout'

import { changeAppLang, changeAppTheme } from './constants/msg_key'
import themes from './constants/themes'
import TestLimit from './pages/test_limit'
import { useImmer, useSubscriber } from './utils/hooks'

type ContextState = {
  theme: string
  lang: string
}
const initContext = {
  theme: 'default',
  lang: 'zh_CN',
}

const AppContext = createContext<ContextState>(initContext)

export const getAppContext = () => useContext(AppContext)

// 重写 withTheme 类型
type WithAppTheme = <P, R = React.FunctionComponent<P & Partial<DefaultTheme>>>(component: R) => R
export const withAppTheme: WithAppTheme = withTheme as any

const App = hot(() => {
  const [state, setState] = useImmer<ContextState>(initContext)
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
      <ToastComponent closeButton theme={theme} timeout={2000} className="m-t-xl" />
      <AlertComponent theme={theme} />
      <AppContext.Provider value={state}>
        <ThemeProvider theme={themes[theme]}>
          <Switch>
            <PrestRoute pathToComponent path="/login" />
            <PrivateRoute path="/">
              <Layout>
                <Switch>
                  <PrestRoute path="/test_limit" component={TestLimit} />
                  <PrestRoute exact pathToComponent="dashboard" path="/" />
                  <AppMenuRoutes />
                  <Route path="*" component={NotMatch} />
                </Switch>
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
