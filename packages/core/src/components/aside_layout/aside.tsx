import { AsideNav } from 'amis'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

type Props = {
  theme: string
  asideMenus: any[]
}
export default ({ theme, asideMenus }: Props) => {
  const location = useLocation()
  const isActive = (link: any) => {
    return link.path && !!(link.path === location.pathname)
  }
  return (
    <AsideNav theme={theme} renderLink={renderNav} isActive={isActive} navigations={asideMenus} />
  )
}

function renderNav({ link, toggleExpand, classnames: cx }: any) {
  const { children: routeChildren, active, icon, label, badge, badgeClassName, path } = link
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
      // eslint-disable-next-line
      <a onClick={routeChildren ? () => toggleExpand(link) : undefined}>{children}</a>
    )
  }

  return active ? (
    // eslint-disable-next-line
    <a> {children} </a>
  ) : (
    <Link to={path}>{children}</Link>
  )
}
