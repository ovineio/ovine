import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotMatch from '~/pages/404'
import Login from '~/pages/login'
import { PrivateRoute } from '~/routes/route'

export const initApp = () => {
  render(
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/" exact />
        <Route path="*" component={NotMatch} />
      </Switch>
    </Router>,
    document.getElementById('app-root')
  )
}
