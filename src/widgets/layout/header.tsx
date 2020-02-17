import React from 'react'
import { Link } from 'react-router-dom'

import { logoUrl } from '~/constants'
import { withAppTheme } from '~/theme_util'

import { LayoutCommProps } from './common'
import HeadItem from './head_item'
import ItemMsg from './item_msg'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import ItemUser from './item_user'

export default withAppTheme<LayoutCommProps>((props) => {
  const { setLayout, asideFolded, theme } = props
  const toggleScreen = () => {
    setLayout((d) => {
      d.offScreen = !d.offScreen
    })
  }

  return (
    <>
      <div className={`${theme.ns}Layout-brandBar`}>
        <button className="pull-right visible-xs mobile-menu" onClick={toggleScreen}>
          <i className="fa fa-bars" />
        </button>
        <Link
          className={`${theme.ns}Layout-brand app-layout-brand text-c-i`}
          to="/"
          title="Dashboard"
        >
          <img className="inline brand-logo" src={logoUrl} />
          <span className="hidden-folded m-l-sm inline">RT-ADMIN</span>
        </Link>
      </div>
      <div className={`${theme.ns}Layout-headerBar`}>
        <div id="app-header-left" className="nav navbar-nav hidden-xs">
          <HeadItem
            faIcon={asideFolded ? 'indent' : 'dedent'}
            tip={`${asideFolded ? '展开' : '收起'}侧边栏`}
            onClick={() =>
              setLayout((d) => {
                d.asideFolded = !d.asideFolded
              })
            }
          />
          <HeadItem
            tip="github仓库"
            faIcon="github"
            onClick={() => window.open('https://github.com/CareyToboo/rt-admin', '_blank')}
          />
        </div>
        <div className="hidden-xs pull-right">
          <ItemSearch />
          <ItemMsg />
          <ItemUser />
          <ItemSetting {...props} />
        </div>
      </div>
    </>
  )
})
