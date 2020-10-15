/**
 * APP 系统设置
 */

import { toast } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import map from 'lodash/map'
import React from 'react'

import { app } from '@/app'
import { Amis } from '@/components/amis/schema'
import { useAppContext } from '@/components/app/context'
import { storage } from '@/constants'
import { setAppLimits } from '@/routes/limit/exports'
import { changeAppTheme } from '@/styled/theme'
import { useImmer } from '@/utils/hooks'
import { getGlobal, getStore, setStore } from '@/utils/store'

import HeadItem from './head_item'

type Props = RendererProps

type State = {
  settingVisible: boolean
  limitVisible: boolean
}
const initState = {
  settingVisible: false,
  limitVisible: false,
}

export default (props: Props) => {
  const { theme } = props

  const [state, setState] = useImmer<State>(initState)
  const { enableRouteTabs, setContext } = useAppContext()

  const { settingVisible } = state

  const supportRouteTabs = getGlobal(storage.supportRouteTabs)

  const toggleSetting = () => {
    setState((d) => {
      d.settingVisible = !d.settingVisible
    })
  }

  const onClearCache = () => {
    toggleSetting()
    localStorage.clear()
    sessionStorage.clear()
    toast.success('缓存已经被清理', '操作成功')
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
  if (app.env.mode === 'localhost') {
    devItems = [
      { type: 'divider' },
      {
        type: 'lib-blank',
        label: '测试权限',
        className: 'from-item-button',
        body: {
          type: 'lib-limit-setting',
          saveConfirmText:
            '权限测试修改，仅对自己有效，刷新页面后可预览最新权限。清除缓存可恢复所有权限。',
          button: {
            actionType: 'drawer',
          },
          modal: {
            title: '测试环境设置权限',
            postion: 'right',
            resizable: true,
            className: 'hide-close-button',
          },
          getLimit: () => {
            return getStore<string>(storage.dev.limit) || ''
          },
          onSave: (data: any) => {
            setStore(storage.dev.limit, data.authLimit)
            setStore(storage.dev.api, data.authApi)
            setAppLimits(data.authLimit)
            window.location.reload()
          },
        },
      },
    ]
  }

  const schema = {
    type: 'drawer',
    size: 'sm',
    actions: [],
    show: settingVisible,
    onClose: toggleSetting,
    position: 'right',
    title: {
      type: 'wrapper',
      className: 'no-padder no-bg-c',
      body: {
        type: 'html',
        html: '<div><i class="fa fa-cog p-r-xs"></i><span>系统设置</span></div>',
      },
    },
    body: {
      type: 'lib-css',
      css: `
      .from-item-button {
        .form-control-static {
          padding: 0;
        }
        label {
          padding-top: 13px;
        }
      }
    `,
      body: {
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
          supportRouteTabs && {
            type: 'switch',
            name: 'enableRouteTabs',
            label: '路由选项卡',
            value: enableRouteTabs,
            onChange: (enable: boolean) => {
              setContext((d) => {
                d.enableRouteTabs = enable
              })
              setStore(storage.enableRouteTabs, enable)
              toggleSetting()
            },
          },
          {
            type: 'lib-blank',
            name: '',
            label: '系统缓存',
            className: 'from-item-button',
            body: {
              type: 'button',
              icon: 'fa fa-trash-o',
              label: '清除',
              confirmText: '本地缓存数据将被删除，确认清除？',
              onAction: onClearCache,
            },
          },
          ...devItems,
        ].filter(Boolean),
      },
    },
  }

  const cofItemProps = {
    faIcon: 'cog',
    tip: '设置',
    onClick: toggleSetting,
  }

  return (
    <>
      <HeadItem theme={theme} itemProps={cofItemProps} />
      <Amis schema={schema} />
    </>
  )
}
