import { confirm, render, toast } from 'amis'
import { RenderOptions, RootRenderProps } from 'amis/lib/factory'
import { Action } from 'amis/lib/types'
import { DefaultTheme } from 'styled-components'

import { app } from '@/app'
import logger from '@/utils/logger'

import { amisResAdapter } from '../exports'
import { normalizeLink } from './func'
import { RtSchema } from './types'

const log = logger.getLogger('lib:components:amis:schema')

type Option = {
  schema: RtSchema
  theme: DefaultTheme
  history: any
  option?: RenderOptions
  props?: RootRenderProps
  [prop: string]: any
}
export default (option: Option) => {
  const { schema, props, theme, option: amisOption, history } = option

  const env: any = {
    session: 'global',
    // number 固底间距 顶部间距
    affixOffsetTop: 50, // 系统默认值 50
    // number 固底间距，当你的有其x他固底元素时，需要设置一定的偏移量，否则会重叠。
    affixOffsetBottom: 0,
    // 富文本编辑器 token， 内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者自己实现 rich-text 渲染器。
    richTextToken: false,
    // 请求模块
    fetcher: (reqOpts: any) => {
      return app.request(reqOpts).then(amisResAdapter)
    },
    // 是否取消 ajax请求
    isCancel: (value: any) => {
      log.log('isCancel', value)
      if (value.name === 'AbortError') {
        log.info('请求被终止', value)
        return true
      }
      return false
    },
    // 消息提示
    notify: (msgType: string, msg: string) => {
      log.log('notify', msgType, msg)
      // 默认跳过表单错误 提示
      if (/表单验证失败/.test(msg)) {
        return
      }
      const tipMsg = (toast as any)[msgType]
      const isError = msgType === 'error'
      if (tipMsg) {
        tipMsg(
          msg || `未知${isError ? '异常' : '消息'}`,
          msgType === 'error' ? '系统异常' : '系统提示'
        )
      }
    },
    // 实现警告提示。
    alert: (msg: string) => {
      log.log('alert', msg)
    },
    // 实现确认框。 boolean | Promise<boolean>
    confirm: (msg: string, title?: string) => {
      let confirmTitle = title || '提示'
      let confirmText = msg || ''
      if (!title && msg.indexOf('[') === 0 && msg.indexOf(']') > 0) {
        const end = msg.indexOf(']')
        confirmText = msg.substr(end + 1)
        confirmTitle = msg.substring(1, end)
      }

      log.log('confirm: ', msg)
      return confirm(confirmText, confirmTitle)
    },
    // 实现页面跳转
    jumpTo: (to: string, action?: Action, ctx?: object) => {
      log.log('jumpTo', to, action, ctx)
      const { href } = normalizeLink({ to })
      history.push(href)
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
      history.push(href)
    },
    // 判断目标地址是否为当前页面。
    isCurrentUrl: (to: string) => {
      const { href } = normalizeLink({ to })
      log.log('isCurrentUrl', href)
      return href === window.location.href
    },
    // 实现，内容复制。
    copy: (contents: string, options?: { shutup: boolean }) => {
      log.log('copy', contents, options)
    },
    // HTMLElement 决定弹框容器。
    // getModalContainer: () => {
    //   log.log('getModalContainer')
    // },
    // Promise<Function>  可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。
    // 大型组件可能需要异步加载。比如：富文本编辑器
    loadRenderer: (loaderSchema: any, path: string) => {
      log.log('loadRenderer', loaderSchema, path)
    },
  }

  return render(schema, props, {
    // rendererResolver: (...args) =>
    //   envResolver({ path: args[0], schema: args[1], props: args[2], theme }),
    ...env,
    ...amisOption,
    theme: theme.name,
  })
}
