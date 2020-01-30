import { render, toast } from 'amis'
import { fetcherConfig, RendererProps, RenderOptions } from 'amis/lib/factory'
import { Action, SchemaNode } from 'amis/lib/types'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import logger from '~/utils/logger'

const log = logger.getLogger('dev:amisSchema')

type Props = {
  schema: SchemaNode
  props?: RendererProps
  option?: RenderOptions
}

export const renderAmis = render

export const Schema = withRouter((props: Props & RouteComponentProps<any>) => {
  const { schema, props: amisProps = {}, option = {}, history } = props

  const aimsEnv = {
    session: 'global',
    // 'default' | 'cxd' 目前支持两种主题。
    theme: 'default',
    // number 固顶间距，当你的有其他固顶元素时，需要设置一定的偏移量，否则会重叠。
    affixOffsetTop: 0,
    //  number 固底间距，当你的有其他固底元素时，需要设置一定的偏移量，否则会重叠。
    affixOffsetBottom: 0,
    //  string 内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者自己实现 rich-text 渲染器。
    richTextToken: false,
    // 获取数据
    fetcher: (config: fetcherConfig) => {
      log.log('fetcher', config)
    },
    // 是否取消 ajax请求
    isCancel: (value: any) => {
      log.log('isCancel', value)
    },
    // 实现消息提示
    notify: (type: string, msg: string) => {
      log.log('notify', type, msg)
      // 默认跳过表单错误 提示
      if (/msg/.test('表单验证失败')) {
        return
      }
      if (type === 'error') {
        toast.error(msg, '系统错误')
      }
    },
    // 实现警告提示。
    alert: (msg: string) => {
      log.log('alert', msg)
    },
    // 实现确认框。 boolean | Promise<boolean>
    confirm: (msg: string) => {
      log.log('confirm', msg)
    },
    // 实现页面跳转，因为不清楚所在环境中是否使用了 spa 模式，所以用户自己实现吧。
    jumpTo: (to: string, action?: Action, ctx?: object) => {
      log.log('jumpTo', to, action, ctx)
    },
    // 地址替换，跟 jumpTo 类似。
    updateLocation: (location: any, replace?: boolean) => {
      log.log('updateLocation', location, replace ? 'replace' : 'push')
      history[replace ? 'replace' : 'push'](location)
    },
    // 判断目标地址是否为当前页面。
    isCurrentUrl: (link: string) => {
      log.log('isCurrentUrl', link)
    },
    // 实现，内容复制。
    copy: (contents: string, options?: { shutup: boolean }) => {
      log.log('copy', contents, options)
    },
    // HTMLElement 决定弹框容器。
    getModalContainer: () => {
      log.log('getModalContainer')
    },
    // Promise<Function>  可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。
    loadRenderer: (loaderSchema: any, path: string) => {
      log.log('loadRenderer', loaderSchema, path)
    },
  }

  return renderAmis(schema, amisProps, {
    ...aimsEnv,
    ...option,
  } as any)
})
