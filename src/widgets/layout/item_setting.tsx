/**
 * APP 系统设置
 */

import { Drawer } from 'amis'
import React from 'react'

import '~/assets/styles/themes/default.css'
import { useImmer } from '~/utils/hooks'

import { Schema } from '../amis/schema'

import { LayoutCommProps } from './common'
import HeadItem from './head_item'

type SettingProps = LayoutCommProps

const getSchema = (option: SettingProps) => {
  return {
    type: 'wrapper',
    body: [
      {
        type: 'html',
        html: `<h5 class="login-title m-t-xs m-b-lg">系统设置</h5>`,
      },
      {
        type: 'form',
        mode: 'horizontal',
        horizontal: { left: 'col-sm-4', right: 'col-sm-8' },
        wrapWithPanel: false,
        controls: [
          {
            type: 'select',
            name: 'select',
            label: '选择主题',
            options: [
              {
                label: 'Option A',
                value: 'a',
              },
              {
                label: 'Option B',
                value: 'b',
              },
            ],
          },
        ],
      },
    ],
  }
}

const Setting = (props: SettingProps) => {
  return <Schema schema={getSchema(props)} />
}

type Props = LayoutCommProps

type State = {
  settingVisible: boolean
}
const initState = {
  settingVisible: false,
}

export default (props: Props) => {
  const { theme } = props
  const [state, setState] = useImmer<State>(initState)

  const { settingVisible } = state

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
      <HeadItem theme={theme} faIcon="cog" tooltip="设置" onClick={toggleSetting} />
    </>
  )
}
