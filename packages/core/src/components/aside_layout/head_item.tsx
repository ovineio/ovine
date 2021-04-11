/**
 * App头部工具 ICON 按钮
 */

import { RendererProps } from 'amis/lib/factory'
import React, { cloneElement } from 'react'

import { withAppTheme } from '@/app/theme'
import { jumpTo, JumpToOption } from '@/routes/exports'

import { Amis } from '../amis/schema'

type HeadItemProps = JumpToOption & {
  className?: string
  icon?: string
  faIcon?: string
  children?: any
  tip?: string
  onClick?: any
  href?: string
  body?: any
}

type Props = Partial<RendererProps> & {
  itemProps: HeadItemProps
}

export default withAppTheme<Props>((props) => {
  const { itemProps, theme, classPrefix } = props
  const ns = theme.ns || classPrefix
  const {
    className = '',
    icon,
    faIcon,
    children,
    onClick,
    href,
    blank,
    origin,
    replace,
    tip,
    body,
  } = itemProps

  const onItemClick = (e: any) => {
    if (href) {
      jumpTo(href, { blank, origin, replace })
    }

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div
      className={`${ns}Button ${className} ${ns}Button--blank ${ns}Button--iconOnly`}
      onClick={onItemClick}
    >
      {!icon && !faIcon ? null : (
        <i className={`${icon || `fa fa-${faIcon}`}`} data-position="bottom" data-tooltip={tip} />
      )}
      {children &&
        (!tip
          ? children
          : cloneElement(children, { 'data-tooltip': tip, 'data-position': 'bottom' }))}
      {body && <Amis schema={body} />}
    </div>
  )
})
