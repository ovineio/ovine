import 'react-hot-loader'

import React from 'react' // tslint:disable-line
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NotMatch from '~/pages/404'
import App from '~/pages/app'
import Login from '~/pages/login'

import 'amis/lib/themes/default.css'

render(
  <Router>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" exact component={App} />
      <Route path="*" component={NotMatch} />
    </Switch>
  </Router>,
  document.getElementById('app-root')
)
