import { theme as setAmisTheme } from 'amis'

import { app } from '@/app'
import { storage, message } from '@/constants'
import { publish } from '@/utils/message'
import { setStore } from '@/utils/store'

// const { name: storedTheme } = app.theme.getTheme()

const dispatchLink = (theme: string, callback?: () => void) => {
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
  // 非amis主题 都需要注册
  Object.values(app.theme.getAllThemes())
    .filter((item: any) => !/cxd|default|dark/.test(item.name))
    .forEach((item: any) => {
      setAmisTheme(item.name, {
        classPrefix: item.ns,
      })
    })

  // dispatchLink(storedTheme)
}
