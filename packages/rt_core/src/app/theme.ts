import defaultsDeep from 'lodash/defaultsDeep'
import { FunctionComponent } from 'react'
import { DefaultTheme, withTheme } from 'styled-components'

import { storage } from '@/constants'
import presetThemes from '@/styles/styled/themes'
import { getStore } from '@/utils/store'

type Themes = {
  default: DefaultTheme
  [theme: string]: Types.DeepPartial<DefaultTheme>
}

type ThemeNames = keyof Themes

// 重写 withTheme 类型
type WithAppTheme = <P, C = FunctionComponent<P & { theme: DefaultTheme }>>(
  component: C
) => FunctionComponent<P>

export const withAppTheme: WithAppTheme = withTheme as any

export class AppTheme {
  private themes: Types.ObjectOf<DefaultTheme> = presetThemes

  constructor(appThemes?: Themes) {
    this.themes = defaultsDeep(appThemes, this.themes)
  }

  getTheme(): DefaultTheme {
    const theme = getStore<ThemeNames>(storage.appTheme) || 'default'
    return {
      name: 'default',
      ...this.themes[theme],
    }
  }

  getAllThemes() {
    return this.themes
  }
}
