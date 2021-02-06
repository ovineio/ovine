import { defaultsDeep } from 'lodash'

import OverlayScrollbars from 'overlayscrollbars'
import React, { Component, RefObject } from 'react'

import 'overlayscrollbars/css/OverlayScrollbars.css'

interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: any
  ver?: boolean
  hor?: boolean
  height?: string | number
  options?: OverlayScrollbars.Options
  extensions?: OverlayScrollbars.Extensions
}
interface ScrollBarState {}

class ScrollBar extends Component<ScrollBarProps, ScrollBarState> {
  private _osInstance: OverlayScrollbars | null = null

  private _osTargetRef: RefObject<HTMLDivElement>

  constructor(props: ScrollBarProps) {
    super(props)
    this._osTargetRef = React.createRef()
  }

  componentDidMount() {
    this._osInstance = OverlayScrollbars(this.osTarget(), this.getOptions(), this.props.extensions)
    mergeHostClassNames(this._osInstance, this.props.className)
  }

  componentDidUpdate(prevProps: ScrollBarProps) {
    if (OverlayScrollbars.valid(this._osInstance)) {
      this._osInstance.options(this.getOptions())

      if (prevProps.className !== this.props.className) {
        mergeHostClassNames(this._osInstance, this.props.className)
      }
    }
  }

  componentWillUnmount() {
    if (OverlayScrollbars.valid(this._osInstance)) {
      this._osInstance.destroy()
      this._osInstance = null
    }
  }

  getOptions() {
    const { hor = false, ver = true } = this.props

    return defaultsDeep(this.props.options, {
      className: 'os-theme-dark',
      overflowBehavior: {
        x: hor ? 'scroll' : 'hidden',
        y: ver ? 'scroll' : 'hidden',
      },
      scrollbars: {
        autoHide: 'leave',
        autoHideDelay: 0,
      },
    })
  }

  osTarget(): HTMLDivElement | null {
    return this._osTargetRef.current || null
  }

  osInstance(): OverlayScrollbars | null {
    return this._osInstance
  }

  render() {
    const { height } = this.props

    const style = {
      height: height || '100%',
    }

    return (
      <div className="os-host" style={style} ref={this._osTargetRef}>
        <div className="os-resize-observer-host" />
        <div className="os-padding">
          <div className="os-viewport">
            <div className="os-content">{this.props.children}</div>
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-horizontal ">
          <div className="os-scrollbar-track">
            <div className="os-scrollbar-handle" />
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-vertical">
          <div className="os-scrollbar-track">
            <div className="os-scrollbar-handle" />
          </div>
        </div>
        <div className="os-scrollbar-corner" />
      </div>
    )
  }
}

function mergeHostClassNames(osInstance: OverlayScrollbars, className: string) {
  if (OverlayScrollbars.valid(osInstance)) {
    const { host } = osInstance.getElements()
    const regex = new RegExp(
      `(^os-host([-_].+|)$)|${osInstance.options().className.replace(/\s/g, '$|')}$`,
      'g'
    )
    const osClassNames = host.className
      .split(' ')
      .filter((name) => name.match(regex))
      .join(' ')

    host.className = `${osClassNames} ${className || ''}`
  }
}

export default ScrollBar
