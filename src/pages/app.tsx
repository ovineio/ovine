import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import React from 'react'
import Home from './home'
import ReactDOM from 'react-dom'

setConfig({
  ignoreSFC: !!ReactDOM.setHotElementComparator,
  pureSFC: true,
  pureRender: true,
})

const App = () => <Home />

setConfig({
  logLevel: 'debug',
})

export default hot(App)
