import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import Home from './home'

setConfig({
  ignoreSFC: !!ReactDOM.setHotElementComparator,
  pureSFC: true,
  pureRender: true,
  logLevel: 'debug',
})

const App = () => <Home />

export default hot(App)
