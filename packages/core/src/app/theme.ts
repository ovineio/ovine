import { defaultsDeep } from 'lodash'
import { FunctionComponent } from 'react'
import { DefaultTheme, withTheme } from 'styled-components'

import { storage } from '@/constants'
import presetThemes from '@/styled/themes'
import { getStore } from '@/utils/store'
import * as Types from '@/utils/types'

type Themes = {
  [theme: string]: Types.DeepPartial<DefaultTheme>
}

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

  getName() {
    const currTheme = getStore<string>(storage.appTheme) || process.env.INIT_THEME || 'cxd'
    return currTheme
  }

  initThemes(appThemes: Themes) {
    this.themes = defaultsDeep(appThemes, this.themes)
  }

  getTheme(): DefaultTheme {
    const currTheme = this.getName()
    return (
      this.themes[currTheme] || {
        name: 'cxd',
      }
    )
  }

  getAllThemes() {
    return this.themes
  }
}
