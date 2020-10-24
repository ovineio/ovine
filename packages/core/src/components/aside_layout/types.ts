import { RouteItem } from '@/routes/types'
import { ImmerSetter } from '@/utils/hooks'
import { ReqOption } from '@/utils/request/types'

import { LibSchema } from '../amis/schema/types'

export type AsideLayoutState = {
  asideFolded: boolean
  offScreen: boolean
  header: HeaderProps
  routes: RouteItem[]
  footer?: LibSchema
}

export type LayoutCommProps = AsideLayoutState & {
  setLayout: ImmerSetter<AsideLayoutState>
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

export type LayoutProps = Partial<{
  children: any
  api: ReqOption
  routeTabs: RouteTabs
  header: HeaderProps
  footer: LibSchema
  routes: RouteItem[]
}>
