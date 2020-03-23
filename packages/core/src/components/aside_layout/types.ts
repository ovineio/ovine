import { RouteItem } from '@/routes/types'
import { ImmerSetter } from '@/utils/hooks'

import { RtSchema } from '../amis/schema/types'

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
  showDevItem?: boolean
}

export type LayoutProps = {
  children?: any
  layoutKey?: string
  header?: HeaderProps
  footer?: RtSchema
  routes?: RouteItem[]
}
