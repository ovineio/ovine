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

export type RouteItem = Omit<LinkItem, 'children' | 'component'> &
  Pick<RouteProps, 'component'> & {
    badge?: number
    badgeClassName?: string
    pathToComponent?: boolean | string
    children?: RouteItem[]
    sideVisible?: boolean
  }

export type PageProps = RouteItem & LazyRouteProps & PagePreset

export type LimitMenuItem = RouteItem &
  Limit & {
    limitKey?: string
    disabled?: boolean
  }

export type PagePreset = {
  // 当前 schema唯一标示，不填默认是组件在项目中路径, 用来错误提示
  schemaId?: string
  // 页面所有权限定义
  limits?: Types.ObjectOf<Limit>
  // 页面内所有异步请求
  apis?: Types.ObjectOf<RequestOption & LimitSchema>
}

export type LazyRouteProps = RouteProps & {
  pathToComponent?: boolean | string
  withSuspense?: boolean
  fallback?: any
}
