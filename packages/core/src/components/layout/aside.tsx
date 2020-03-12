import { AsideNav } from 'amis'
import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { withAppTheme } from '@/app/theme'
import { getRoutePath } from '@/routes/exports'
import { getAsideMenus } from '@/routes/limit'

import { LayoutCommProps } from './types'

type Props = LayoutCommProps

const renderNav = ({ link, toggleExpand, classnames: cx }: any) => {
  const { children: routeChildren, icon, label, badge, badgeClassName, path } = link
  const children = []

  if (routeChildren) {
    children.push(
      <span
        key="expand-toggle"
        className={cx('AsideNav-itemArrow')}
        onClick={(e) => toggleExpand(link, e)}
      />
    )
  }

  if (badge) {
    children.push(
      <b key="badge" className={cx('AsideNav-itemBadge', badgeClassName || 'bg-info')}>
        {badge}
      </b>
    )
  }

  if (icon) {
    children.push(<i key="icon" className={cx('AsideNav-itemIcon', icon)} />)
  }

  if (label) {
    children.push(
      <span className={cx('AsideNav-itemLabel')} key="label">
        {label}
      </span>
    )
  }

  if (!path) {
    return (
      <button type="button" onClick={routeChildren ? () => toggleExpand(link) : undefined}>
        {children}
      </button>
    )
  }

  return <Link to={getRoutePath(path)}>{children}</Link>
}

export default withAppTheme<Props>((props) => {
  const location = useLocation()

  return (
    <AsideNav
      theme={props.theme.name}
      renderLink={renderNav}
      navigations={getAsideMenus() as any}
      isActive={(link: any) => !!(getRoutePath(link.path) === location.pathname)}
    />
  )
})
