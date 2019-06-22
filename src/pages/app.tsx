import jquery from 'jquery'
import React, { Suspense } from 'react'
// import { setHotElementComparator } from 'react-dom'
// import { setConfig } from 'react-hot-loader'
// import { hot } from 'react-hot-loader/root'
import { BrowserRouter } from 'react-router-dom'

import { MainLayoutRoutes } from '@routes'
;(window as any).$ = jquery

// setConfig({
//   ignoreSFC: !!setHotElementComparator,
//   pureSFC: true,
//   pureRender: true,
//   logLevel: 'debug',
// })

const App = () => (
  <BrowserRouter>
    <Suspense fallback="">{MainLayoutRoutes} </Suspense>
  </BrowserRouter>
)

export default App // hot(App)
