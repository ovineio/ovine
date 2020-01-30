import React from 'react'
import { Link } from 'react-router-dom'

import { logoUrl } from '~/constants'

import { themes, LayoutCommProps } from './common'
import HeadItem from './head_item'
import ItemMsg from './item_msg'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import ItemUser from './item_user'

type Props = LayoutCommProps

export default (props: Props) => {
  const { theme, setLayout, asideFolded } = props

  const { ns: themeNs } = themes[theme]

  return (
    <>
      <div className={`${themeNs}Layout-brandBar`}>
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
          className={`${themeNs}Layout-brand app-layout-brand text-c-i`}
          to="/"
          title="Dashboard"
        >
          <img className="inline brand-logo" src={logoUrl} />
          <span className="hidden-folded m-l-sm inline">RT-ADMIN</span>
        </Link>
      </div>
      <div className={`${themeNs}Layout-headerBar`}>
        <div className="nav navbar-nav hidden-xs">
          <HeadItem
            theme={theme}
            faIcon={asideFolded ? 'indent' : 'dedent'}
            tooltip={`${asideFolded ? '展开' : '收起'}侧边栏`}
            onClick={() =>
              setLayout((d) => {
                d.asideFolded = !d.asideFolded
              })
            }
          />
        </div>
        <div className="hidden-xs pull-right">
          <ItemSearch theme={theme} />
          <HeadItem theme={theme} tooltip="帮助" faIcon="question-circle" />
          <ItemMsg theme={theme} />
          <ItemUser theme={theme} />
          <ItemSetting {...props} />
        </div>
      </div>
    </>
  )
}
