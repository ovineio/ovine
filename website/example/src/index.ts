/**
 * ‘@core’ 是 '@ovine/core/lib' 的别名
 * ‘～/*’  是 '/src/' 的别名
 */

import { AppConfig } from '@core/app/types'
import { DeepPartial } from '@core/utils/types'

import { amis } from './app/amis'
import { appConstants as constants } from './app/constants'
import { entry } from './app/entry'
import { env } from './app/env'
import { request } from './app/request'
import remotePageMockSource from './pages/application/hot/mock'
import remotePagePreset from './pages/application/hot/preset'
import globalStyle from './styled/global'
import { theme } from './styled/theme'

// 应用配置
const config: DeepPartial<AppConfig> = {
  env, // 必填参数，应用环境配置
  entry, // 必填参数，应用入口
  // 以下都是可选, 根据自己需求去实现,不做强制要求
  request,
  theme,
  constants,
  amis,
  styled: {
    globalStyle,
  },
  hook: {
    beforeCreate(app, appConfig) {
      return new Promise(function(resolve) {
        // 可在此配置 entry，实现动态路由
        // 支持页面全局函数hook
        if (window.BEFORE_OVINE_CREATE) {
          window.BEFORE_OVINE_CREATE(app, appConfig, resolve)
        } else {
          resolve()
        }
      })
    },
    afterCreated(app, source) {
      // 支持异步操作
      return new Promise(function(resolve) {
        // 远程页面如果需要 preset 和 mockSource 功能，需要在此添加进 source.asyncPage.mock 和 source.asyncPage.preset 中，因为 preset 和 mock的获取都是同步操作，无法异步加载，所以需要提前获取
        source.asyncPage.mock['/remote/root'] = remotePageMockSource
        source.asyncPage.preset['/remote/root'] = remotePagePreset
        // 支持页面全局函数hook
        if (window.AFTER_OVINE_CREATED) {
          window.AFTER_OVINE_CREATED(app, source, resolve)
        } else {
          resolve()
        }
      })
    },
  },
}

export default config
