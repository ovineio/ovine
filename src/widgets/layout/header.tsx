import React from 'react'
import { Link } from 'react-router-dom'

import { logoUrl } from '~/constants'
import { withAppTheme } from '~/theme'

import { LayoutCommProps } from './common'
import HeadItem from './head_item'
import ItemMsg from './item_msg'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import ItemUser from './item_user'

export default withAppTheme<LayoutCommProps>((props) => {
  const { setLayout, asideFolded, theme } = props
  return (
    <>
      <div className={`${theme.ns}Layout-brandBar`}>
        <button
          onClick={() =>
            setLayout((d) => {
              d.offScreen = !d.offScreen
            })
          }
          className="pull-right visible-xs"
        >
          <i className="glyphicon glyphicon-align-justify" />
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
        <div className="nav navbar-nav hidden-xs">
          <HeadItem
            faIcon={asideFolded ? 'indent' : 'dedent'}
            tip={`${asideFolded ? '展开' : '收起'}侧边栏`}
            onClick={() =>
              setLayout((d) => {
                d.asideFolded = !d.asideFolded
              })
            }
          />
        </div>
        <div className="hidden-xs pull-right">
          <ItemSearch />
          <HeadItem tip="帮助" faIcon="question-circle" />
          <ItemMsg />
          <ItemUser />
          <ItemSetting {...props} />
        </div>
      </div>
    </>
  )
})
