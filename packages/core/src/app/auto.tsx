/**
 * 简化 Ovine 应用，自动导入文件等
 */

import React from 'react'
import { render } from 'react-dom'

import { App } from '@/components/app'
import { appRootId, storage } from '@/constants'
import { initAppTheme } from '@/styled/theme'
import { initLogger } from '@/utils/logger'
import { getGlobal } from '@/utils/store'

import appConfig from '~/app.auto'

/**
 * 初始化 ovine 全局对象
 */
export function initOvineGlobal() {
  window.ovine = {
    addPageSchemaJs: (pageAlias: string, schema: any) => {
      const app: any = getGlobal(storage.appInstance)
      app.asyncPage.schema = app.asyncPage.schema || {}
      app.asyncPage.schema[pageAlias] = schema
    },
  }
}

function initApp() {
  initOvineGlobal()
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
