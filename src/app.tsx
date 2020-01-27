import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotMatch from '~/pages/404'
import Login from '~/pages/login'
import { PrivateRoute } from '~/routes/route'
import Layout from '~/widgets/layout'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/">
          <Layout>
            <Switch>
              <Route path="/a" component={() => <div>123</div>} />
              <Route path="*" component={NotMatch} />
            </Switch>
          </Layout>
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

export const initApp = () => {
  render(<App />, document.getElementById('app-root'))
}
