import { theme as setAmisTheme } from 'amis'

import { themeNamePrefix } from './constants'
import { changeAppTheme as themeKey } from './constants/msg_key'
import { appTheme } from './constants/store_key'
import themes from './constants/themes'
import { getThemeCssAsync } from './routes/utils'
import { getAppTheme } from './theme_util'
import { publish } from './utils/message'
import { setStore } from './utils/store'
import { changeDomCls } from './utils/tool'

const loadingCls = 'theme-is-loading' // 异步加载CSS，会导致页面抖动
const { name: storedTheme } = getAppTheme()
const loadedCss: Types.ObjectOf<boolean> = {
  [storedTheme]: true,
}
const pace = (window as any).Pace

export const changeAppTheme = (theme: string) => {
  const loading = !loadedCss[theme]
  let bodyCls = `${themeNamePrefix}${theme}`
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
  changeDomCls(document.body, 'add', `${themeNamePrefix}${storedTheme}`)

  // 非amis主题 都需要注册
  Object.values(themes)
    .filter((item) => !/cxd|default|dark/.test(item.name))
    .forEach((item) => {
      setAmisTheme(item.name, {
        classPrefix: item.ns,
      })
    })
  getThemeCssAsync(storedTheme)
}
