import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import React, { Suspense } from 'react'
import { setHotElementComparator } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import config from '@config'
import routes from '@routes/index'
import { queryStringParse } from '@utils/tool'
import logger from '@utils/logger'

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
    <Suspense fallback="">{routes}</Suspense>
  </BrowserRouter>
)

export default hot(App)
