import { theme as setAmisTheme } from 'amis'

import { app } from '@/app'
import { themeNamePrefix, storage, message } from '@/constants'
import { getThemeCssAsync } from '@/routes/exports'
import { publish } from '@/utils/message'
import { setStore } from '@/utils/store'
import * as Types from '@/utils/types'

const loadingCls = 'theme-is-loading' // 异步加载CSS，会导致页面抖动

const { name: storedTheme } = app.theme.getTheme()
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

  $('body').addClass(bodyCls)
  getThemeCssAsync(theme).then(() => {
    publish(message.appTheme, theme)
    setStore(storage.appTheme, theme)
    if (loading) {
      loadedCss[theme] = true
      setTimeout(() => {
        $('body').removeClass(bodyCls)
        pace.stop()
      }, 1000)
    }
  })
}

export const initAppTheme = () => {
  $('body').addClass(`${themeNamePrefix}${storedTheme}`)

  // 非amis主题 都需要注册
  Object.values(app.theme.getAllThemes())
    .filter((item: any) => !/cxd|default|dark/.test(item.name))
    .forEach((item: any) => {
      setAmisTheme(item.name, {
        classPrefix: item.ns,
      })
    })
  getThemeCssAsync(storedTheme)
}
