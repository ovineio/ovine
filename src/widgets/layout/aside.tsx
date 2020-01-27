import AsideNav from 'amis/lib/components/AsideNav'
import React from 'react'
import { useLocation, Link } from 'react-router-dom'

import { routesConfig } from '~/routes/config'

import { LayoutCommProps } from './common'

type Props = LayoutCommProps

const contextPath = ''
const pathPrefix = ''

const getPath = (path: string[] | string) => {
  return path && path[0] === '/' ? contextPath + path : `${contextPath}${pathPrefix}/${path}`
}

const renderLink = ({ link, toggleExpand, classnames: cx }: any) => {
  const children = []

  if (link.children) {
    children.push(
      <span
        key="expand-toggle"
        className={cx('AsideNav-itemArrow')}
        onClick={(e) => toggleExpand(link, e)}
      />
    )
  }

  if (link.badge) {
    children.push(
      <b key="badge" className={cx(`AsideNav-itemBadge`, link.badgeClassName || 'bg-info')}>
        {link.badge}
      </b>
    )
  }

  if (link.icon) {
    children.push(<i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />)
  }

  if (link.label) {
    children.push(
      <span className={cx(`AsideNav-itemLabel`)} key="label">
        {link.label}
      </span>
    )
  }

  if (!link.path) {
    return <a onClick={link.children ? () => toggleExpand(link) : undefined}>{children}</a>
  }

  return <Link to={getPath(link.path)}>{children}</Link>
}

export default (props: Props) => {
  const { theme } = props
  const location = useLocation()

  return (
    <AsideNav
      theme={theme}
      navigations={routesConfig}
      renderLink={renderLink}
      isActive={(link: any) => !!(getPath(link.path) === location.pathname)}
    />
  )
}
