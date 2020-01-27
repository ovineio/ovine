import { ImmerSetter } from '~/utils/hooks'

type ThemeItem = {
  ns: string
  text: string
}

export type LayoutState = {
  asideFolded: boolean
  offScreen: boolean
  headerVisible: boolean
  theme: string
}

export type LayoutCommProps = LayoutState & {
  setLayout: ImmerSetter<LayoutState>
}

export const themes: Types.ObjectOf<ThemeItem> = {
  default: {
    ns: 'a-',
    text: '默认主题',
  },
  light: {
    ns: 'l-',
    text: '清新主题',
  },
  cxd: {
    ns: 'cxd-',
    text: '淡雅主题',
  },
  dark: {
    ns: 'dark-',
    text: '暗黑主题',
  },
}
