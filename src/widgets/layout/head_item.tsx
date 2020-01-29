/**
 * app头部工具ICON按钮
 */

import { Button } from 'amis'
import { TooltipObject } from 'amis/lib/components/TooltipWrapper'
import React from 'react'

type Props = {
  theme: string
  icon?: string
  faIcon?: string
  className?: string
  children?: any
  tooltip?: string | TooltipObject
  onClick?: any
  itemContent?: any
}
export default (props: Props) => {
  const { theme, icon, className = '', faIcon, children, onClick, tooltip, itemContent } = props

  const toolTip = !itemContent
    ? tooltip
    : {
        render: () => itemContent,
      }

  return (
    <Button
      iconOnly
      className={`no-shadow head-item ${className}`}
      theme={theme}
      level="link"
      placement="bottom"
      tooltipTrigger={itemContent ? 'focus' : 'hover'}
      onClick={onClick}
      tooltip={toolTip}
    >
      {(icon || faIcon) && <i className={icon ? icon : `fa fa-${faIcon} fa-fw`} />}
      {children}
    </Button>
  )
}
