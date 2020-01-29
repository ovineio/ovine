import React from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotMatch from '~/pages/404'
import Login from '~/pages/login'
import { renderAppRoutes, PrivateRoute } from '~/routes/route'
import Layout from '~/widgets/layout'

const App = hot(() => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/">
          <Layout>
            <Switch>
              {renderAppRoutes()}
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
