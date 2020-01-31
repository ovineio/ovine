/**
 * 页面渲染错误处理
 */

import React from 'react'

import logger from '~/utils/logger'
import { uuid } from '~/utils/tool'

type Props = {
  type?: 'page' | 'component' | 'entry'
  children: any
}
type State = {
  hasError: boolean
}

const refreshPage = () => {
  const hash = uuid()
  const url = location.href
  const refreshUrl =
    url.indexOf('_refresh=') > -1
      ? `${url.split('_refresh=')[0]}_refresh=${hash}` // 存在 _refresh 直接替换
      : `${url}${url.indexOf('?') === -1 ? '?' : '&'}_refresh=${uuid()})}` // 否则添加一个刷新值

  location.href = refreshUrl
}

const log = logger.getLogger('app:widgets:ErrorBoundary')

class ErrorBoundary extends React.Component<Props, State> {
  public static getDerivedStateFromError(error: any) {
    log.error('getDerivedStateFromError:', error)
    return { hasError: true }
  }

  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  public componentDidCatch(error: any, errorInfo: any) {
    log.error('componentDidCatch:', error, errorInfo)
  }

  public render() {
    const { children, type = 'component' } = this.props
    const { hasError } = this.state
    if (hasError) {
      switch (type) {
        case 'page':
          return this.renderPageError()
        default:
          return this.renderCompError()
      }
    }

    return children
  }

  // 页面内组件加载错误
  private renderCompError() {
    return <div>组件错误</div>
  }

  // 页面加载错误
  private renderPageError() {
    return (
      <div>
        页面错误
        <ul>
          <li onClick={refreshPage}>刷新页面</li>
        </ul>
      </div>
    )
  }
}

export default ErrorBoundary
