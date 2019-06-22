import jquery from 'jquery'
import React, { Suspense } from 'react'
import { setHotElementComparator } from 'react-dom'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter } from 'react-router-dom'

import config from '@config'
import { MainLayoutRoutes } from '@routes'
import logger from '@utils/logger'
import { queryStringParse } from '@utils/tool'
;(window as any).$ = jquery

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

const App = () => (
  <BrowserRouter>
    <Suspense fallback="">{MainLayoutRoutes} </Suspense>
  </BrowserRouter>
)

export default hot(App)
