import React from 'react'
import { Link } from 'react-router-dom'

import { getRoutePath } from '@core/routes/exports'

export default (props) => {
  const { menus = [] } = props

  const renderItems = (items = [], isSub = false) => {
    return items.map((item) => {
      const { children, label, path } = item
      const isActive = getRoutePath(path) === window.location.pathname

      if (children) {
        return (
          <li className="nav-item dropdown">
            <Link
              to={path}
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {label}
            </Link>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              {renderItems(children)}
            </div>
          </li>
        )
      }

      if (isSub) {
        return (
          <Link className="dropdown-item" to={path}>
            {label}
          </Link>
        )
      }

      return (
        <li className="nav-item">
          <Link className={`nav-link ${isActive ? 'active' : ''}`} to={path}>
            <span>{label}</span>
          </Link>
        </li>
      )
    })
  }

  return <ul className="navbar-nav mr-auto mt-2 mt-lg-0">{renderItems(menus)}</ul>
}
