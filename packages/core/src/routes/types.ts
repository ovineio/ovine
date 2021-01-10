import { LinkItem } from 'amis/lib/components/AsideNav'
import { RouteProps } from 'react-router-dom'

import { AmisProps } from '@/components/amis/schema'
import { ReqOption } from '@/utils/request/types'
import * as Types from '@/utils/types'

export type Limit = {
  label: string
  icon?: string
  needs?: string[]
  desc?: string
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
    nodeLabel?: string // 节点面包屑 label
    limitLabel?: string // 权限label
    badge?: number
    badgeClassName?: string
    pathToComponent?: boolean | string | ReqOption
    children?: RouteItem[]
    highlightParent?: boolean // 但侧边栏不可见时，是否高亮父tab， 默认 true
    sideVisible?: boolean // 侧边栏是否可见
    ignoreLimit?: boolean // 是否忽略权限，默认 false
    limitOnly?: boolean // 该配置只为权限
    routeTabShared?: boolean // 共用 routeTab
    // routeTabInitQuery?: object
  }

export type LimitMenuItem = RouteItem &
  Limit & {
    disabled?: boolean
  }

export type PageFileOption = Partial<Pick<RouteItem, 'path' | 'pathToComponent' | 'nodePath'>>

export type PresetRouteProps = Omit<RouteProps, 'path'> &
  PageFileOption & {
    debounceRoute?: number
    withSuspense?: boolean
    fallback?: any
  }

export type PageProps = Omit<RouteItem, keyof PagePreset> & PresetRouteProps

export type PresetComponentProps = PresetRouteProps & {
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

export type PresetCtxState = PagePreset & {
  route: RouteProps
}

export type PrivateRouteProps = RouteProps & {
  onAuth: (() => boolean) | Promise<Boolean>
  onRedirect: () => string
  redirect?: string
}
