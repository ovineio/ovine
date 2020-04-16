import { LinkItem } from 'amis/lib/components/AsideNav'
import { RouteProps } from 'react-router-dom'

import { AmisProps } from '@/components/amis/schema'
import { ReqOption } from '@/utils/request/types'
import * as Types from '@/utils/types'

export type Limit = {
  label: string
  icon?: string
  needs?: string[]
  description?: string
}

export type LimitSchema = {
  limits?: string | string[]
  limitsLogic?: 'and' | 'or'
}

export type PagePreset = {
  // 不需要手动设置
  nodePath?: string
  // 页面所有权限定义
  limits?: Types.ObjectOf<Limit>
  // 页面内所有异步请求
  apis?: Types.ObjectOf<
    ReqOption &
      LimitSchema & {
        key?: string
        actionAddr?: string
      }
  >
}

export type RouteItem = Omit<LinkItem, 'children' | 'component'> &
  Pick<RouteProps, 'component' | 'exact' | 'sensitive' | 'strict'> &
  PagePreset & {
    nodePath: string
    nodeLabel?: string
    badge?: number
    badgeClassName?: string
    pathToComponent?: boolean | string
    children?: RouteItem[]
    sideVisible?: boolean
    limitOnly?: boolean // 该配置只为权限
  }

export type LimitMenuItem = Omit<RouteItem, 'apis'> &
  Limit & {
    disabled?: boolean
    apis?: Types.ObjectOf<{
      url: string
      key?: string
      limits?: string | string[]
    }>
  }

export type PageFileOption = Partial<Pick<RouteItem, 'path' | 'pathToComponent' | 'nodePath'>>

export type PresetRouteProps = Omit<RouteProps, 'path'> &
  PageFileOption & {
    withSuspense?: boolean
    fallback?: any
  }

export type PageProps = Omit<RouteItem, keyof PagePreset> & PresetRouteProps

export type PresetComponentProps = PresetRouteProps &
  PageFileOption & {
    LazyFileComponent?: any
    RouteComponent?: any
    lazyFileAmisProps?: AmisProps
  }

export type CheckLimitFunc = (
  limitKeys?: string | string[],
  option?: {
    nodePath?: string
    limits?: any
  }
) => boolean

export type PresetCtxState = PagePreset
