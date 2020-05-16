import { defaultsDeep } from 'lodash'
import React from 'react'
import { render } from 'react-dom'

import { App } from '@/components/app'
import { appRootId, storage } from '@/constants'
import { initAppTheme } from '@/styled/theme'
import { setConfig } from '@/utils/logger'
import { getGlobal } from '@/utils/store'
import { getQuery } from '@/utils/tool'

import appConfig from '~/index'

function initLogger(loggerConf: any = {}) {
  const moduleName = getQuery('loggerModule') || loggerConf?.moduleName
  const debugLevel: any = getQuery('loggerLevel') || loggerConf?.level || 'log'
  const loggerConfig = defaultsDeep(
    {
      moduleName,
      level: debugLevel,
      enable: !!moduleName,
    },
    loggerConf
  )
  setConfig(loggerConfig)
}

function initApp() {
  const app: any = getGlobal(storage.appInstance)
  app.create(appConfig)
  initLogger(app.env.logger)
  initAppTheme()

  const $mounted = document.getElementById(appRootId) || document.createElement('div')
  render(<App />, $mounted)
}

initApp()
