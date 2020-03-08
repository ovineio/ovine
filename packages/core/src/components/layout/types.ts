import { ImmerSetter } from '@/utils/hooks'

export type LayoutState = {
  asideFolded: boolean
  offScreen: boolean
  headerVisible: boolean
}

export type LayoutCommProps = LayoutState & {
  setLayout: ImmerSetter<LayoutState>
}
