import { throttle } from 'lodash'
import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

const StyledBackTop = styled.div`
  position: fixed;
  z-index: -2;
  right: 20px;
  bottom: 40px;
  width: 44px;
  height: 44px;
  opacity: 0;
  text-align: center;
  line-height: 44px;
  border: 1px solid #e8ebee;
  border-radius: 50%;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  color: #666;
  font-size: 16px;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    color: #108cee;
  }

  &.visible {
    opacity: 1;
    z-index: 2;
  }
`

export default () => {
  const $wrap = useRef(null)

  const onBackTop = () => {
    $('html,body').animate(
      {
        scrollTop: 0,
      },
      200
    )
  }

  const onScroll = throttle(() => {
    if (!$wrap.current) {
      return
    }
    const $top = $($wrap.current)

    if (window.scrollY >= 100) {
      if (!$top.hasClass('visible')) {
        $top.addClass('visible')
      }
    } else {
      $top.removeClass('visible')
    }
  }, 200)

  useEffect(() => {
    window.onscroll = onScroll
  }, [])

  return (
    <StyledBackTop ref={$wrap} onClick={onBackTop}>
      <i className="fa fa-rocket" />
    </StyledBackTop>
  )
}
