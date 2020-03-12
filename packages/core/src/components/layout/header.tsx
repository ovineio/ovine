import React from 'react'
import { Link } from 'react-router-dom'

import { withAppTheme } from '@/app/theme'

import HeadItem from './head_item'
import ItemMsg from './item_msg'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import ItemUser from './item_user'
import { LayoutCommProps } from './types'

export default withAppTheme<LayoutCommProps>((props) => {
  const { setLayout, asideFolded, theme } = props
  const toggleScreen = () => {
    setLayout((d) => {
      d.offScreen = !d.offScreen
    })
  }

  const logoUrl = ''
  const title = ''

  return (
    <>
      <div className={`${theme.ns}Layout-brandBar`}>
        <button className="pull-right visible-xs mobile-menu" type="button" onClick={toggleScreen}>
          <i className="fa fa-bars" />
        </button>
        <Link
          className={`${theme.ns}Layout-brand app-layout-brand text-c-i`}
          to="/"
          title="Dashboard"
        >
          <img className="inline brand-logo" src={logoUrl} alt="logo" />
          <span className="hidden-folded m-l-sm inline">{title}</span>
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
            href="https://github.com/CareyToboo/rt-admin"
          />
          <HeadItem
            tip="使用文档"
            faIcon="question-circle-o"
            href="http://rt-admin.igroupes.com/rtdocs/"
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
