/**
 * APP 系统设置
 * TODO:
 * 1. 拆分设置功能，每个独立设置项都抽离为独立组件，可自由配置在任何地方
 */

import { toast } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import map from 'lodash/map'
import React from 'react'

import { app } from '@/app'
import { Amis } from '@/components/amis/schema'
import { useAppContext } from '@/components/app/context'
import { message, storage } from '@/constants'
import { setAppLimits } from '@/routes/limit/exports'
import { changeAppTheme } from '@/styled/theme'
import { useImmer } from '@/utils/hooks'
import { publish } from '@/utils/message'
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

  const onChangeLocale = (choseLocale: string, prevLocale?: string) => {
    if (!prevLocale) {
      return
    }
    if (choseLocale !== prevLocale) {
      toggleSetting()
      setStore(storage.appLocale, choseLocale)
      publish(message.appLocale, choseLocale)
    }
  }

  let devItems: any[] = []
  if (app.env.mode === 'localhost') {
    devItems = [
      { type: 'divider' },
      {
        type: 'button-toolbar',
        label: '测试权限',
        className: 'from-item-button',
        buttons: [
          {
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
            onSaveClick: (data: any) => {
              setStore(storage.dev.limit, data.authLimit)
              setStore(storage.dev.api, data.authApi)
              setAppLimits(data.authLimit)
              window.location.reload()
            },
          },
        ],
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
      }
    `,
      body: {
        type: 'form',
        mode: 'horizontal',
        horizontal: { left: 'col-sm-4', right: 'col-sm-8' },
        wrapWithPanel: false,
        data: {
          theme,
          locale: getStore(storage.appLocale) || app.amis.locale || 'zh-CN',
        },
        body: [
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
            type: 'select',
            name: 'locale',
            label: '选择语言',
            options: [
              {
                label: '中文',
                value: 'zh-CN',
              },
              {
                label: 'English',
                value: 'en-US',
              },
            ],
            onChange: onChangeLocale,
          },
          supportRouteTabs && {
            type: 'switch',
            onText: '启用',
            offText: '关闭',
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
            type: 'button-toolbar',
            name: '',
            label: '系统缓存',
            className: 'from-item-button',
            buttons: [
              {
                type: 'button',
                icon: 'fa fa-trash-o',
                label: '清除',
                confirmText: '本地缓存数据将被删除，确认清除？',
                onAction: onClearCache,
              },
            ],
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
      <HeadItem itemProps={cofItemProps} />
      <Amis schema={schema} />
    </>
  )
}
