import { Button, Drawer } from 'amis/lib/components'
import React from 'react'

import { logoUrl } from '~/constants'
import { useImmer } from '~/utils/hooks'

import { themes, LayoutCommProps } from './common'
import Setting from './setting'

type Props = LayoutCommProps
type State = {
  settingVisible: boolean
}

const initState = {
  settingVisible: false,
}
export default (props: Props) => {
  const { theme, setLayout, asideFolded } = props
  const [state, setState] = useImmer<State>(initState)

  const { settingVisible } = state

  const { ns: themeNs } = themes[theme]

  const toggleSetting = () => {
    setState((d) => {
      d.settingVisible = !d.settingVisible
    })
  }

  return (
    <>
      <Drawer theme={theme} size="sm" onHide={toggleSetting} show={settingVisible} position="right">
        <Setting {...props} />
      </Drawer>
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
        <div className="hidden-xs pull-right">
          <Button
            iconOnly
            theme={theme}
            className="no-shadow navbar-btn"
            level="link"
            placement="bottom"
            tooltip="系统设置"
            onClick={toggleSetting}
          >
            <i className="fa fa-cog fa-fw" />
          </Button>
        </div>
      </div>
    </>
  )
}
