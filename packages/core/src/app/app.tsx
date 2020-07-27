import { defaults } from 'lodash'
import React from 'react'
import { render } from 'react-dom'

import { App } from '@/components/app'
import { appRootId, storage } from '@/constants'
import { initAppTheme } from '@/styled/theme'
import { setConfig } from '@/utils/logger'
import { getGlobal } from '@/utils/store'
import { getUrlParams } from '@/utils/tool'

import appConfig from '~/index'

function initLogger(loggerConf: any = {}) {
  const moduleName = getUrlParams('loggerModule') || loggerConf?.moduleName || ''
  const loggerLevel = getUrlParams('loggerLevel') || loggerConf?.level || 'log'
  const loggerConfig = defaults(
    {
      moduleName,
      level: loggerLevel,
      enable: !!moduleName,
    },
    loggerConf
  )
  setConfig(loggerConfig)
}

function initApp() {
  const app: any = getGlobal(storage.appInstance)
  // 转为异步创建app实例，方便调用hook
  app.create(appConfig).then(function() {
    initLogger(app.env.logger)
    initAppTheme()

    const $mounted = document.getElementById(appRootId) || document.createElement('div')
    render(<App />, $mounted)
  })
}

initApp()
