import { theme as setAmisTheme } from 'amis'
import { FunctionComponent } from 'react'
import { withTheme, DefaultTheme } from 'styled-components'

import { changeAppTheme as themeKey } from './constants/msg_key'
import { appTheme } from './constants/store_key'
import themes from './constants/themes'
import { getThemeCssAsync } from './routes/utils'
import { publish } from './utils/message'
import { getStore, setStore } from './utils/store'
import { changeDomCls } from './utils/tool'

export const getAppTheme = () => getStore<string>(appTheme) || 'default'

const themePrefix = 'app-theme-'
const loadingCls = 'theme-is-loading' // 异步加载CSS，会导致页面抖动
const storedTheme = getAppTheme()
const loadedCss: Types.ObjectOf<boolean> = {
  [storedTheme]: true,
}
const pace = (window as any).Pace

export const changeAppTheme = (theme: string) => {
  const loading = !loadedCss[theme]
  let bodyCls = `${themePrefix}${theme}`
  if (loading) {
    pace.restart()
    bodyCls += ` ${loadingCls}`
  }

  changeDomCls(document.body, 'add', bodyCls)
  getThemeCssAsync(theme).then(() => {
    publish(themeKey, theme)
    setStore(appTheme, theme)
    if (loading) {
      loadedCss[theme] = true
      setTimeout(() => {
        changeDomCls(document.body, 'remove', loadingCls)
        pace.stop()
      }, 1000)
    }
  })
}

export const initAppTheme = () => {
  changeDomCls(document.body, 'add', `${themePrefix}${storedTheme}`)

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
