/**
 * App头部工具 ICON 按钮
 */

import { Button, TooltipWrapper } from 'amis'
import React from 'react'

import { withAppTheme } from '~/theme'

type Props = {
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
}
export default withAppTheme<Props>((props) => {
  const {
    theme,
    className = '',
    tooltipClassName,
    icon,
    faIcon,
    trigger,
    triggerContent,
    children,
    onClick,
    tip,
  } = props

  const isClickOpen = trigger === 'click'
  const withContent = !!trigger ? trigger : undefined

  const toolTip = withContent && {
    render: () => triggerContent,
  }

  const button = (
    <Button
      iconOnly
      className={`no-shadow app-head-item ${className}`}
      theme={theme.name}
      level="link"
      placement="bottom"
      onClick={onClick}
      tooltipTrigger={withContent && trigger}
      tooltip={!isClickOpen ? toolTip : undefined}
    >
      {(icon || faIcon) && (
        <i
          className={icon ? icon : faIcon ? `fa fa-${faIcon} fa-fw` : ''}
          // TODO: BUG 点击 item 的时候也会 重新显示提示
          data-tooltip={tip}
          data-position="bottom"
        />
      )}
      {!tip ? (
        children
      ) : (
        <div data-tooltip={tip} data-position="bottom">
          {children}
        </div>
      )}
    </Button>
  )

  if (!isClickOpen) {
    return button
  }

  return (
    <TooltipWrapper
      rootClose
      placement="bottom"
      trigger="click"
      theme={theme.name}
      tooltip={toolTip}
      tooltipClassName={tooltipClassName}
    >
      {button}
    </TooltipWrapper>
  )
})
