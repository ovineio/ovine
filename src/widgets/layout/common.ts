import themeConfig from '~/assets/scripts/theme'

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

export const themes: Types.ObjectOf<ThemeItem> = themeConfig
