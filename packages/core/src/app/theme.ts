import defaultsDeep from 'lodash/defaultsDeep'
import { FunctionComponent } from 'react'
import { DefaultTheme, withTheme } from 'styled-components'

import { storage } from '@/constants'
import presetThemes from '@/styled/themes'
import { getStore } from '@/utils/store'
import * as Types from '@/utils/types'

type Themes = {
  default: DefaultTheme
  [theme: string]: Types.DeepPartial<DefaultTheme>
}

// 重写 withTheme 类型
type WithAppTheme = <P, C = FunctionComponent<P & { theme: DefaultTheme }>>(
  component: C
) => FunctionComponent<P>

export const withAppTheme: WithAppTheme = withTheme as any

export class AppTheme {
  private themes: Types.ObjectOf<DefaultTheme> = presetThemes

  private initTheme = 'default'

  constructor(initTheme?: string, appThemes?: Themes) {
    this.initTheme = getStore<string>(storage.appTheme) || initTheme || 'default'
    this.themes = defaultsDeep(appThemes, this.themes)
  }

  initThemes(appThemes: Themes) {
    this.themes = defaultsDeep(appThemes, this.themes)
  }

  getTheme(): DefaultTheme {
    return {
      name: 'default',
      ...this.themes[this.initTheme],
    }
  }

  getAllThemes() {
    return this.themes
  }
}
