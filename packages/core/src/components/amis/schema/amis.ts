import { confirm, render, toast, alert } from 'amis'
import { RootRenderProps } from 'amis/lib/Root'
import { RenderOptions } from 'amis/lib/factory'
import { Action } from 'amis/lib/types'
import { tokenize } from 'amis/lib/utils/tpl-builtin'
import copy from 'copy-to-clipboard'
import { get } from 'lodash'

import { app } from '@/app'
import { jumpTo, normalizeLink } from '@/routes/exports'
import logger from '@/utils/logger'

import { libFetcher } from './api'
import { LibSchema } from './types'

const log = logger.getLogger('lib:components:amis:schema')

type Option = {
  schema: LibSchema
  option?: RenderOptions
  props?: RootRenderProps
  [prop: string]: any
}

export default (option: Option) => {
  const { schema, props = {}, option: amisOption = {} } = option
  const { theme, locale } = amisOption

  const baseEnv = {
    theme,
    fetcher: libFetcher,

    // 是否取消 ajax请求
    isCancel: (reson: any) => {
      const isCancel = get(reson, 'error.name') === 'AbortError'
      if (isCancel) {
        log.info('isCancel 请求被终止')
        return true
      }
      return false
    },

    // 实现，内容复制。// 实现，内容复制。
    copy: (contents: string, options?: { shutup: boolean }) => {
      const ret = copy(contents, options as any)
      if (ret && (!options || options.shutup !== true)) {
        toast.info('已拷贝到剪切板')
      }
      return ret
    },

    // 实现警告提示。
    alert: (msg: string) => {
      log.log('alert', msg)
      alert(msg)
    },

    // HTMLElement 决定弹框容器。 ---- TODO: amis-editor 有兼容问题
    // getModalContainer: () => {
    //   return document.getElementById('modal-root')
    // },

    // 消息提示
    notify: (msgType: string = 'error', msg: string = '') => {
      log.log('notify', { msgType, msg })
      // 默认跳过表单错误 提示
      if (/依赖的部分字段没有通过验证/.test(msg)) {
        return
      }
      const tipMsg = (toast as any)[msgType]
      let msgTitle = msgType === 'error' ? '系统错误' : '系统提示'
      let msgText = '系统发生未知异常'
      if (msg && typeof msg === 'string') {
        msgText = msg
        if (msg.indexOf('[') === 0 && msg.indexOf('] ') > 0) {
          const end = msg.indexOf('] ')
          msgText = msg.substr(end + 1)
          msgTitle = msg.substring(1, end)
        }
      }

      if (tipMsg) {
        tipMsg(msgText, msgTitle)
      }
    },

    // 实现确认框。 boolean | Promise<boolean>
    confirm: (msg: string, title?: string) => {
      let confirmTitle = title || '系统提示'
      let confirmText = msg || ''
      if (!title && msg.indexOf('[') === 0 && msg.indexOf('] ') > 0) {
        const end = msg.indexOf('] ')
        confirmText = msg.substr(end + 1)
        confirmTitle = msg.substring(1, end)
      }

      log.log('confirm: ', msg)
      return confirm(confirmText, confirmTitle)
    },
  }
  ;(window as any).OVINE_AMIS_ENV = baseEnv

  const libOptions: any = {
    ...baseEnv,
    session: 'global',
    // number 固底间距 顶部间距
    affixOffsetTop: 50, // 系统默认值 50
    // number 固底间距，当你的有其x他固底元素时，需要设置一定的偏移量，否则会重叠。
    affixOffsetBottom: 0,
    // 富文本编辑器 token， 内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者自己实现 rich-text 渲染器。
    richTextToken: false,

    // 实现页面跳转
    jumpTo: (to: string, action: Action, ctx: object) => {
      const { blank, replace, origin } = action || {}

      if (to.indexOf('$') > -1 && ctx) {
        to = tokenize(to, ctx)
      }

      log.log('jumpTo', { to, action, ctx })

      jumpTo(to, { blank, replace, origin })
    },
    // 地址替换，跟 jumpTo 类似。
    updateLocation: (to: any, replace: boolean = false) => {
      const { href, pathname } = normalizeLink({ to })

      const isReplace = pathname === window.location.pathname
      log.log('updateLocation', replace ? 'replace ' : 'push', isReplace, href)

      if (isReplace) {
        window.history.replaceState(null, '', href)
        return
      }
      app.routerHistory.push(href)
    },
    // 判断目标地址是否为当前页面。
    isCurrentUrl: (to: string) => {
      const { href } = normalizeLink({ to })
      const isCurrent = href === window.location.href.replace(window.location.origin, '')
      log.log('isCurrentUrl', isCurrent, href)
      return isCurrent
    },

    // Promise<Function>  可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。
    // 大型组件可能需要异步加载。比如：富文本编辑器
    loadRenderer: (loaderSchema: any, path: string) => {
      log.log('loadRenderer', loaderSchema, path)
    },

    // rendererResolver: libResolver,
  }

  const rendererOption: any = {
    ...libOptions,
    ...app.amis,
    ...amisOption,
  }

  const rendererProps = {
    ...props,
    theme,
    locale,
  }

  // console.log('@===>', props, rendererOption)
  return render(schema, rendererProps, rendererOption)
}
