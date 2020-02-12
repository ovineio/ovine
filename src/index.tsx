import 'react-hot-loader/patch'

import '~/assets/scripts/include'
import config from '~/config'
import logger, { setConfig } from '~/utils/logger'
import { queryStringParse } from '~/utils/tool'
import '~/widgets/amis/rt_renderers'

import initApp from './app'
import { initUser } from './core/user'
import { initAppTheme } from './theme'

// 初始化日志模块
const initLogger = () => {
  const debugReg = queryStringParse('logger_debug') || config.debug
  const debugLevel = queryStringParse('logger_level') || 'log'

  setConfig({
    moduleName: debugReg,
    level: debugLevel as any,
    enable: !!debugReg,
  })

  const log = logger.getLogger('app:main')
  log.info('appConfig', config)
}

initLogger()
initAppTheme()
initUser()

window.onload = initApp
