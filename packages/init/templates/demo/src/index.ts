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
}

export default config
