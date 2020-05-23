import { Renderer } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React from 'react'

import { StyledDropdown } from './styled'

const animation = {
  enter: 'slide-up-enter slide-up-enter-active',
  leave: 'slide-up-leave slide-up-leave-active',
  duration: 200,
}

type Props = RendererProps & {
  items?: any
  hover?: any
  body?: any
}

@Renderer({
  test: /(^|\/)lib-dropdown$/,
  name: 'lib-dropdown',
})
export class LibDropdown extends React.Component<Props> {
  $wrapperRef: any

  constructor(props: Props) {
    super(props)
    this.$wrapperRef = React.createRef()
  }

  componentDidMount() {
    const { hover } = this.props
    const config = {
      sensitivity: 3, // number = sensitivity threshold (must be 1 or higher)
      interval: 200, // number = milliseconds for onMouseOver polling interval
      timeout: 200, // number = milliseconds delay before onMouseOut
      ...hover,
      over: doOpen, // function = onMouseOver callback (REQUIRED)
      out: doClose, // function = onMouseOut callback (REQUIRED)
    }

    function doOpen(this: any) {
      $('ul:first', this)
        .removeClass(animation.leave)
        .addClass(`show ${animation.enter}`)
    }

    function doClose(this: any) {
      const $ul = $('ul:first', this)
        .removeClass(animation.enter)
        .addClass(animation.leave)
      setTimeout(() => {
        $ul.removeClass(`show ${animation.leave}`)
      }, animation.duration)
    }

    $(this.$wrapperRef.current).hoverIntent(config)
  }

  render() {
    const { items, body, render, classPrefix, className = '' } = this.props

    return (
      <StyledDropdown ref={this.$wrapperRef} className={`${classPrefix}LibDropdown ${className}`}>
        {body && render('body', body)}
        {items && (
          <ul className="dropdown-menu m-t-xs r b">
            {items.map((item: any, index: number) => {
              return (
                <li key={index} className="dropdown-item">
                  {render('body', item)}
                </li>
              )
            })}
          </ul>
        )}
      </StyledDropdown>
    )
  }
}
