/**
 * App头部工具 ICON 按钮
 */

import { Button } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import React, { cloneElement } from 'react'

import { Amis } from '../amis/schema'

type HeadItemProps = {
  trigger?: 'click' | 'focus'
  className?: string
  tooltipClassName?: string
  triggerContent?: any
  icon?: string
  faIcon?: string
  bsIcon?: string
  children?: any
  tip?: string
  onClick?: any
  href?: string
  body?: any
}

type Props = Partial<RendererProps> & {
  itemProps: HeadItemProps
}

export default (props: Props) => {
  const { itemProps, theme } = props
  const { className = '', icon, faIcon, children, onClick, href, tip, body } = itemProps

  const onItemClick = (e: any) => {
    if (href) {
      window.open(href, '_blank')
    }

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Button
      iconOnly
      theme={theme}
      className={`no-shadow ${className}`}
      onClick={onItemClick}
      level="link"
    >
      {!icon && !faIcon ? null : (
        <i className={`${icon || `fa fa-${faIcon}`}`} data-position="bottom" data-tooltip={tip} />
      )}
      {children &&
        (!tip
          ? children
          : cloneElement(children, { 'data-tooltip': tip, 'data-position': 'bottom' }))}
      {body && <Amis schema={body} />}
    </Button>
  )
}
