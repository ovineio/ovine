import { Renderer } from 'amis'
import React, { useEffect, useRef } from 'react'

import { StyledDropdown } from './styled'

const animation = {
  enter: 'slide-up-enter slide-up-enter-active',
  leave: 'slide-up-leave slide-up-leave-active',
  duration: 200,
}

const LibDropdown = (props: any) => {
  const { items, body, render, classPrefix, className = '', hover = {} } = props
  const $wrapperRef = useRef(null)

  useEffect(() => {
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

    $($wrapperRef.current).hoverIntent(config)
  }, [])

  return (
    <StyledDropdown ref={$wrapperRef} className={`${classPrefix}LibDropdown ${className}`}>
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

Renderer({
  test: /(^|\/)lib-dropdown$/,
  name: 'lib-dropdown',
})(LibDropdown as any)
