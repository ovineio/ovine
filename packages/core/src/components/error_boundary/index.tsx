/**
 * 页面渲染错误处理
 */

// import { uuid } from 'amis/lib/utils/helper'
import React from 'react'

import { app } from '@/app'
import logger from '@/utils/logger'

import { StyledErrorPage } from './styled'

type Props = {
  type?: 'page' | 'component' | 'entry'
  children: any
}

const log = logger.getLogger('lib:components:ErrorBoundary')

type State = {
  error?: any
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(error: any) {
    // log.error('getDerivedStateFromError:', error)
    return { hasError: true, error }
  }

  public componentDidCatch(error: any, errorInfo: any) {
    log.error('componentDidCatch:', error, errorInfo)
  }

  // 每次更新清空错误状态
  public getSnapshotBeforeUpdate(_: any, prevState: State) {
    if (prevState.hasError) {
      this.setState({
        hasError: false,
        error: {},
      })
    }
    return null
  }

  // 页面内组件加载错误
  private renderCompError() {
    return <div>组件错误</div>
  }

  // 页面加载错误
  private renderPageError() {
    const { error } = this.state
    return (
      <StyledErrorPage>
        <div className="inner">
          <div className="error-img" />
          {app.env.isRelease ? (
            <span>当前页面发生错误</span>
          ) : (
            <div className="alert inline" role="alert">
              <h4 className="alert-heading">当前页面发生错误</h4>
              <p>{(error && error.message) || '未知渲染错误'}</p>
              <hr />
              <p>请打开console查看</p>
            </div>
          )}
        </div>
      </StyledErrorPage>
    )
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
}

// const ErrorBoundaryWrap = (props: Props) => {
//   const { children, type } = props

//   // hot热更新环境不处理 error提示
//   if ((module as any).hot) {
//     return children
//   }

//   return <ErrorBoundary type={type}>{children}</ErrorBoundary>
// }

export default ErrorBoundary
