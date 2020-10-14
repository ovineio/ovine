import { RouteItem } from '@/routes/types'
import { ImmerSetter } from '@/utils/hooks'

import { LibSchema } from '../amis/schema/types'

export type LayoutState = {
  asideFolded: boolean
  offScreen: boolean
}

export type LayoutCommProps = LayoutState & {
  setLayout: ImmerSetter<LayoutState>
}

export type HederBrandProps = {
  logo: string
  title: string
  className?: string
  link?: {
    title?: string
    href: string
  }
}

export type HeaderProps = {
  brand: HederBrandProps
  items?: any[]
  showDevItems?: boolean
}

export type RouteTabs = {
  enable?: boolean
  maxCount?: number
  storage?: boolean
}

export type LayoutProps = {
  children?: any
  routeTabs?: RouteTabs
  header?: HeaderProps
  footer?: LibSchema
  routes?: RouteItem[]
}
