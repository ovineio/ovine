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

export type SetLayout = (f: (draft: LayoutState) => void | LayoutState) => void

export const themes: Types.ObjectOf<ThemeItem> = {
  default: {
    ns: 'a-',
    text: '默认主题',
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
