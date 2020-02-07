import { LinkItem } from 'amis/lib/components/AsideNav'
import { RouteProps } from 'react-router-dom'

import { RequestOption } from '~/core/request'

export type Limit = {
  label: string
  icon?: string
  needs?: string[]
  description?: string
}

export type LimitSchema = {
  limits?: string | string[]
}

export type PagePreset = {
  // 不需要手动设置
  nodePath?: string
  // 页面所有权限定义
  limits?: Types.ObjectOf<Limit>
  // 页面内所有异步请求
  apis?: Types.ObjectOf<
    RequestOption &
      LimitSchema & {
        key?: string
      }
  >
}

export type RouteItem = Omit<LinkItem, 'children' | 'component'> &
  Pick<RouteProps, 'component'> &
  PagePreset & {
    nodePath: string
    badge?: number
    badgeClassName?: string
    pathToComponent?: boolean | string
    children?: RouteItem[]
    sideVisible?: boolean
  }

export type PageProps = RouteItem & LazyRouteProps

export type LimitMenuItem = Omit<RouteItem, 'apis'> &
  Limit & {
    disabled?: boolean
    apis?: Types.ObjectOf<{
      url: string
      key?: string
      limits?: string | string[]
    }>
  }

export type PresetRouteProps = Omit<RouteProps, 'path'> & {
  path?: string
  preset?: PagePreset
  pathToComponent?: boolean | string
  withSuspense?: boolean
  fallback?: any
}

export type LazyRouteProps = PresetRouteProps & {
  nodePath?: string
  pathToComponent?: boolean | string
  withSuspense?: boolean
  fallback?: any
}
