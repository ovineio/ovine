import { Button } from 'amis/lib/components'
import React from 'react'

import { logoUrl } from '~/constants'

import { themes, LayoutState, SetLayout } from './common'

type Props = LayoutState & {
  setLayout: SetLayout
}
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
        <div className={`${themeNs}Layout-brand text-c-i`}>
          <img className="inline brand-logo" src={logoUrl} />
          <span className="hidden-folded m-l-sm inline">RT-ADMIN</span>
        </div>
      </div>
      <div className={`${themeNs}Layout-headerBar`}>
        <div className="nav navbar-nav hidden-xs">
          <Button
            iconOnly
            theme={theme}
            className="no-shadow navbar-btn"
            level="link"
            placement="bottom"
            tooltip={`${asideFolded ? '展开' : '收起'}侧边栏`}
            onClick={() =>
              setLayout((d) => {
                d.asideFolded = !d.asideFolded
              })
            }
          >
            <i className={asideFolded ? 'fa fa-indent' : 'fa fa-dedent'} />
          </Button>
        </div>
      </div>
    </>
  )
}
