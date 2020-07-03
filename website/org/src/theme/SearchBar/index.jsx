/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import classnames from 'classnames'
import React, { useRef, useCallback, useEffect } from 'react'

import { useHistory } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

let loaded = false

const Search = (props) => {
  const initialized = useRef(false)
  const searchBarRef = useRef(null)
  const store = useRef({})
  const { siteConfig = {} } = useDocusaurusContext()
  const {
    themeConfig: { algolia },
  } = siteConfig

  const history = useHistory()

  store.current.pathname = history.location.pathname

  useEffect(() => {
    window.$.localScroll({
      lazy: true,
      duration: 300,
      hash: true,
      offset: -70,
    })
  }, [])

  const initAlgolia = () => {
    if (!initialized.current) {
      window.docsearch({
        appId: algolia.appId,
        apiKey: algolia.apiKey,
        indexName: algolia.indexName,
        inputSelector: '#search_input_react',
        algoliaOptions: algolia.algoliaOptions,
        // Override algolia's default selection event, allowing us to do client-side
        // navigation and avoiding a full page refresh.
        handleSelected: (_input, _event, suggestion) => {
          // Use an anchor tag to parse the absolute url into a relative url
          // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
          const link = document.createElement('a')
          link.href = suggestion.url

          // Algolia use closest parent element id #__docusaurus when a h1 page title does not have an id
          // So, we can safely remove it. See https://github.com/facebook/docusaurus/issues/1828 for more details.
          const routePath =
            link.hash === '#__docusaurus' ? `${link.pathname}` : `${link.pathname}${link.hash}`
          history.push(routePath)
          setTimeout(() => {
            window.$.localScroll.scroll(0, link)
          }, 200)
        },
      })
      initialized.current = true
    }
  }

  const loadAlgolia = () => {
    if (!loaded) {
      Promise.all([import('docsearch.js'), import('./algolia.css')]).then(
        ([{ default: docsearch }]) => {
          loaded = true
          window.docsearch = docsearch
          initAlgolia()
        }
      )
    } else {
      initAlgolia()
    }
  }

  const toggleSearchIconClick = useCallback(
    (e) => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus()
      }

      props.handleSearchBarToggle(!props.isSearchBarExpanded)
    },
    [props.isSearchBarExpanded]
  )

  return (
    <div className="navbar__search navbar__item" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames('search-icon', {
          'search-icon-hidden': props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="搜索文档"
        aria-label="Search"
        className={classnames(
          'navbar__search-input',
          { 'search-bar-expanded': props.isSearchBarExpanded },
          { 'search-bar': !props.isSearchBarExpanded }
        )}
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </div>
  )
}

export default Search
