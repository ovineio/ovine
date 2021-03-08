import { RenderOptions } from 'amis/lib/factory'
import { History } from 'history'
import { DefaultTheme } from 'styled-components'

import { LoggerConfig } from '@/utils/logger'
import { Request } from '@/utils/request'
import { ReqOption } from '@/utils/request/types'
import { ClassMethod, DeepPartial, Map, ObjectOf } from '@/utils/types'

import { AppTheme } from './theme'

// 重新整理 ENV 环境变量
type Env = {
  mode: string // 当前环境标示
  domains: Map<string, string> // 所有的域名
  disableLimit?: boolean // 是否开启权限校验
  isRelease?: boolean // 是否 release 环境
  isProd?: boolean // 是否是 production 环境
  logger?: LoggerConfig // 日志打印配置
}

export type EnvConfig = {
  [env: string]: DeepPartial<Env>
}

export type AppAmis = Partial<
  RenderOptions & {
    constants: ObjectOf<string | number> // AMIS 全局变量
    locale: 'zh-CN' | 'en-US' // AMIS 语言配置
    definitions: any // AMIS 全局定义
  }
>

type AppConstants = {
  routePrefix: string | (() => string) // 页面基础路径，默认与 publicPath 一样，也可以单独设置
  rootLimitFlag: string // 页面基础路径，默认与 publicPath 一样，也可以单独设置
  notFound: {
    // 404 页面
    route: string // 默认跳转 404
    pagePath: string // 404 页面文件
  }
  toastDuration?: number // Toast 提示持续时间
  loginRoute?: string // 登录路由
  enableBackTop?: boolean // 是否开启 “快速回到顶部” 功能
}

export interface AppConfig {
  request: any // 请求模块配置
  theme: any // 请求模块配置
  env: EnvConfig // 应用环境变量，必须配置
  amis: AppAmis // Amis 的渲染配置
  styled: {
    // 样式相关的配置
    globalStyle: string | ((theme: DefaultTheme) => any) // 全局样式
  }
  constants: AppConstants // APP变量
  entry: any[] // APP应用入口，必须配置
  hook: {
    // 可以实现动态控制配置，非常灵活
    beforeCreate?: (app: AppDefInstance, config: AppConfig) => Promise<void> // 创建 App 之前的回调
    afterCreated?: (app: AppDefInstance, config: AppConfig) => Promise<void> // 创建 App 之后的 回调
    onAppMounted?: () => void // App 被挂载之后回调
  }
  // 异步数据容器
  asyncPage: {
    schema: any // {path: {schema}} // 页面schema
    preset: any // {path: preset} // 页面预设
    mock: any // {path: mockSource} // 页面mock来源
  }
}
export interface AppDefInstance extends Omit<AppConfig, 'env' | 'constants'> {
  create: (config: AppConfig) => Promise<void>
  entry: any[]
  theme: AppTheme
  env: Env & {
    isMock: boolean
  }
  constants: Omit<AppConstants, 'routePrefix'> & {
    routePrefix: string
  }
  request: ClassMethod<Request, 'request'> & {
    getUrlByOption: (
      option: ReqOption
    ) => {
      url: string
      method: string
    }
  }
}

export type AppMountedProps = {
  routerHistory: History<any>
}
