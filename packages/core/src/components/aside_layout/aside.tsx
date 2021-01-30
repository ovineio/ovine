import { AsideNav } from 'amis'
import { find } from 'lodash'
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { breakpoints, message, storage } from '@/constants'
import { publish } from '@/utils/message'
import { getGlobal, getStore } from '@/utils/store'

type Props = {
  theme: string
  asideMenus: any[]
}
export default (props: Props) => {
  const { theme, asideMenus } = props
  const location = useLocation()

  useEffect(() => {
    if (window.innerWidth <= breakpoints.sm) {
      publish(message.asideLayoutCtrl.msg, {
        key: message.asideLayoutCtrl.toggleScreen,
      })
    }
  }, [location.pathname])

  const isActive = (link: any) => {
    const { path, children, sideVisible = true } = link
    const active = sideVisible && path && path === location.pathname
    // 子菜单 可见时，默认高亮 最近的父菜单
    const invisibleItem = find(
      children,
      (i) => i.path === location.pathname && i.sideVisible === false && i.highlightParent !== false
    )
    if (!active && invisibleItem) {
      return true
    }
    return active
  }

  return (
    <AsideNav theme={theme} renderLink={renderNav} isActive={isActive} navigations={asideMenus} />
  )
}

function renderNav({ link, toggleExpand, classnames: cx }: any) {
  const {
    children: routeChildren,
    sideVisible = true,
    active,
    icon,
    label,
    badge,
    badgeClassName,
    path,
  } = link

  const children = []

  const enableRouteTabs = getStore<boolean>(storage.enableRouteTabs)

  const getRoutePath = () => {
    const storeQuery = getGlobal<any>(storage.routeQuery) || {}
    const query = storeQuery[path]
    return query ? `${path}?${query}` : path
  }

  const onToggleExpand = (e: any) => toggleExpand(link, e)

  const onLinkClick = () => {
    publish(message.routeTabChange)
  }

  if (sideVisible === false) {
    return null
  }

  if (routeChildren) {
    children.push(
      <span key="expand-toggle" className={cx('AsideNav-itemArrow')} onClick={onToggleExpand} />
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

  if (active) {
    return <a> {children} </a>
  }

  if (enableRouteTabs) {
    return (
      <Link to={getRoutePath()} onClick={onLinkClick}>
        {children}
      </Link>
    )
  }

  return <Link to={path}>{children}</Link>
}
