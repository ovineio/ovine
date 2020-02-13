/**
 * APP 系统设置
 */

import { toast, Drawer } from 'amis'
import map from 'lodash/map'
import React from 'react'

import themes from '~/constants/themes'
import { userLogout } from '~/core/user'
import { changeAppTheme, withAppTheme } from '~/theme'
import { useImmer } from '~/utils/hooks'

import { Amis } from '../amis/schema'

import { LayoutCommProps } from './common'
import HeadItem from './head_item'

type SettingProps = LayoutCommProps & {
  theme: string
}

const onClearCache = () => {
  toast.success('缓存已经被清理', '操作成功')
  localStorage.clear()
  setTimeout(userLogout, 1000)
}

const getSettingSchema = (option: SettingProps) => {
  const { theme } = option

  return {
    type: 'wrapper',
    className: 'no-bg',
    body: [
      {
        type: 'html',
        html: `<div class="m-t-xs m-b-lg"><i class="fa fa-cog p-r-xs"></i><span>系统设置</span></div>`,
      },
      {
        type: 'form',
        mode: 'horizontal',
        horizontal: { left: 'col-sm-4', right: 'col-sm-8' },
        wrapWithPanel: false,
        data: {
          theme,
        },
        controls: [
          {
            type: 'select',
            name: 'theme',
            label: '选择主题',
            options: map(themes, ({ text }, key) => ({
              label: text,
              value: key,
            })),
          },
          {
            type: 'rt-blank',
            name: '',
            label: '系统缓存',
            body: {
              type: 'button',
              icon: 'fa fa-trash-o',
              label: '清除',
              confirmText: '本地缓存数据将被删除，需要重新登录，确认清除？',
              onAction: onClearCache,
            },
          },
        ],
        onChange: (formVal: any) => {
          if (formVal.theme !== formVal.__prev.theme) {
            changeAppTheme(formVal.theme)
          }
        },
      },
    ],
  }
}

type Props = LayoutCommProps

type State = {
  settingVisible: boolean
}
const initState = {
  settingVisible: false,
}

export default withAppTheme<Props>((props) => {
  const [state, setState] = useImmer<State>(initState)
  const { theme } = props

  const { settingVisible } = state

  const toggleSetting = () => {
    setState((d) => {
      d.settingVisible = !d.settingVisible
    })
  }

  return (
    <>
      <Drawer
        size="sm"
        theme={theme.name}
        onHide={toggleSetting}
        show={settingVisible}
        position="right"
      >
        <Amis schema={getSettingSchema({ ...props, theme: theme.name })} />
      </Drawer>
      <HeadItem faIcon="cog" tip="设置" onClick={toggleSetting} />
    </>
  )
})
