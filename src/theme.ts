import { theme as setAmisTheme } from 'amis'
import { FunctionComponent } from 'react'
import { withTheme, DefaultTheme } from 'styled-components'

import { changeAppTheme as themeKey } from './constants/msg_key'
import { appTheme } from './constants/store_key'
import themes from './constants/themes'
import { getThemeCssAsync } from './routes/utils'
import { publish } from './utils/message'
import { getStore, setStore } from './utils/store'

export const changeAppTheme = (theme: string) => {
  getThemeCssAsync(theme).then(() => {
    publish(themeKey, theme)
    setStore(appTheme, theme)
  })
}

export const getAppTheme = () => getStore<string>(appTheme) || 'default'

export const initAppTheme = () => {
  // 非amis主题 都需要注册
  Object.values(themes)
    .filter((item) => !/cxd|default|dark/.test(item.name))
    .forEach((item) => {
      setAmisTheme(item.name, {
        classPrefix: item.ns,
      })
    })
  getThemeCssAsync(getAppTheme())
}

// 重写 withTheme 类型
type WithAppTheme = <P, C = FunctionComponent<P & { theme: DefaultTheme }>>(
  component: C
) => FunctionComponent<P>

export const withAppTheme: WithAppTheme = withTheme as any
