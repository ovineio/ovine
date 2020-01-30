import React from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotMatch from '~/pages/404'
import { AppMenuRoutes, LazyRoute, PrivateRoute } from '~/routes/route'
import Layout from '~/widgets/layout'

const App = hot(() => {
  return (
    <Router>
      <Switch>
        <LazyRoute pathToComponent path="/login" />
        <PrivateRoute path="/">
          <Layout>
            <Switch>
              <LazyRoute exact pathToComponent="dashboard" path="/" />
              <AppMenuRoutes />
              <Route path="*" component={NotMatch} />
            </Switch>
          </Layout>
        </PrivateRoute>
      </Switch>
    </Router>
  )
})

export default () => {
  render(<App />, document.getElementById('app-root'))
}
