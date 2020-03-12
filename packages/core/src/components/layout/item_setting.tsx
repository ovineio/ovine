/**
 * APP 系统设置
 */

import { toast, Drawer } from 'amis'
import map from 'lodash/map'
import React from 'react'

import { app } from '@/app'
import { withAppTheme } from '@/app/theme'

import { Amis } from '@/components/amis/schema'
import LimitSetting from '@/components/limit_setting'
import { changeAppTheme } from '@/styled/theme'
import { useImmer } from '@/utils/hooks'

import HeadItem from './head_item'
import { LayoutCommProps } from './types'

type Props = LayoutCommProps

type State = {
  settingVisible: boolean
  limitVisible: boolean
}
const initState = {
  settingVisible: false,
  limitVisible: false,
}

export default withAppTheme<Props>((props) => {
  const [state, setState] = useImmer<State>(initState)
  const { theme } = props

  const { settingVisible, limitVisible } = state

  const toggleSetting = () => {
    setState((d) => {
      d.settingVisible = !d.settingVisible
    })
  }
  const toggleLimitDialog = () => {
    setState((d) => {
      d.limitVisible = !d.limitVisible
    })
  }

  const limitDialog = {
    type: 'dialog',
    title: '测试权限设置',
    show: limitVisible,
    onClose: toggleLimitDialog,
    size: 'md',
    showCloseButton: false,
    data: {
      isTestLimit: true,
    },
    body: {
      component: LimitSetting,
    },
    actions: [],
  }

  const settingPanelProps = {
    ...props,
    toggleSetting,
    toggleLimitDialog,
    theme: theme.name,
  }

  return (
    <>
      <HeadItem faIcon="cog" tip="设置" onClick={toggleSetting} />
      <Drawer
        closeOnOutside
        size="sm"
        theme={theme.name}
        onHide={toggleSetting}
        show={settingVisible}
        position="right"
      >
        <SettingPanel {...settingPanelProps} />
      </Drawer>
      <Amis schema={limitDialog} />
    </>
  )
})

type SettingProps = LayoutCommProps & {
  theme: string
  toggleSetting: () => void
  toggleLimitDialog: () => void
}

const SettingPanel = (option: SettingProps) => {
  const { theme, toggleSetting, toggleLimitDialog } = option

  const onClearCache = () => {
    toggleSetting()
    localStorage.clear()
    sessionStorage.clear()
    toast.success('缓存已经被清理', '操作成功')
    // setTimeout(userLogout, 1000)
  }

  const onChangeTheme = (choseTheme: string, prevTheme?: string) => {
    if (!prevTheme) {
      return
    }
    if (choseTheme !== prevTheme) {
      toggleSetting()
      changeAppTheme(choseTheme)
    }
  }

  let devItems: any[] = []
  if (!app.env.isRelease) {
    devItems = [
      { type: 'divider' },
      {
        type: 'rt-blank',
        label: '测试权限',
        name: '',
        className: 'from-item-button',
        body: {
          type: 'button',
          icon: 'fa fa-lock',
          label: '编辑权限',
          onClick: () => {
            toggleSetting()
            toggleLimitDialog()
          },
        },
      },
    ]
  }

  const schema = {
    css: `
      .from-item-button {
        .form-control-static {
          padding: 0;
        }
      }
    `,
    type: 'wrapper',
    className: 'no-bg-c',
    body: [
      {
        type: 'html',
        html:
          '<div class="m-t-xs m-b-lg"><i class="fa fa-cog p-r-xs"></i><span>系统设置</span></div>',
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
            options: map(app.theme.getAllThemes(), ({ text }, key) => ({
              label: text,
              value: key,
            })),
            onChange: onChangeTheme,
          },
          {
            type: 'rt-blank',
            name: '',
            label: '系统缓存',
            className: 'from-item-button',
            body: {
              type: 'button',
              icon: 'fa fa-trash-o',
              label: '清除',
              confirmText: '本地缓存数据将被删除，需要重新登录，确认清除？',
              onAction: onClearCache,
            },
          },
          ...devItems,
        ],
      },
    ],
  }

  return <Amis schema={schema} />
}
