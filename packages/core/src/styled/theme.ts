import { theme as setAmisTheme, setDefaultTheme } from 'amis'
import { DefaultTheme } from 'styled-components'

import { app } from '@/app'
import { storage, message } from '@/constants'
import { publish } from '@/utils/message'
import { setStore, getStore } from '@/utils/store'

export const dispatchLink = (theme: string, callback?: () => void) => {
  // 当开启 scss 编译时，才会每次热更新更新文件，主要用于主题调试
  setDefaultTheme(theme)
  if ((window as any).IS_SCSS_UPDATE) {
    require(`@generated/styles/themes/${theme}.css`)
    if (callback) {
      callback()
    }
    return
  }
  $('head link[data-theme]').remove()

  const linkAttr = {
    rel: 'stylesheet',
    type: 'text/css',
    'data-theme': theme,
    onLoad: callback,
    href: require(`@generated/styles/themes/${theme}.css`),
  }

  $('<link/>', linkAttr).appendTo('head')
}

export const changeAppTheme = (theme: string) => {
  const $body = $('body')
  $body.removeClass('is-modalOpened').css('opacity', 0)
  dispatchLink(theme, () => {
    publish(message.appTheme, theme)
    setStore(storage.appTheme, theme)
    setTimeout(() => {
      $body.css('opacity', 1)
    }, 300)
  })
}

export const initAppTheme = () => {
  const theme = getStore<string>(storage.appTheme) || 'cxd'
  if ((window as any).IS_SCSS_UPDATE) {
    dispatchLink(theme)
  }
  // 非amis主题 都需要注册
  Object.values(app.theme.getAllThemes())
    .filter((item: DefaultTheme) => !/ang|cxd|antd|dark/.test(item.name))
    .forEach((item: DefaultTheme) => {
      setAmisTheme(item.name, {
        classPrefix: item.ns,
      })
    })
}
