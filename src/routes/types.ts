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
  apis?: Types.ObjectOf<RequestOption & LimitSchema>
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

export type PageProps = RouteItem & LazyRouteProps & PagePreset

export type LimitMenuItem = RouteItem &
  Limit & {
    disabled?: boolean
  }

export type LazyRouteProps = RouteProps & {
  nodePath: string
  pathToComponent?: boolean | string
  withSuspense?: boolean
  fallback?: any
}
