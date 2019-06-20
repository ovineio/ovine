import React from 'react'
import { setHotElementComparator } from 'react-dom'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter } from 'react-router-dom'

import config from '@config'
import { browserRoutes } from '@routes/index'
import logger from '@utils/logger'
import { queryStringParse } from '@utils/tool'

const debugStr = queryStringParse('logger_debug') || config.debug

setConfig({
  ignoreSFC: !!setHotElementComparator,
  pureSFC: true,
  pureRender: true,
  logLevel: 'debug',
})

logger.setConfig({
  moduleName: debugStr,
  enable: !!debugStr,
})

logger.getLogger('app:config').log(config)

const App = () => <BrowserRouter>{browserRoutes}</BrowserRouter>

export default hot(App)
