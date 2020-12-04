/**
 * 权限配置
 */

import { Renderer, filter } from 'amis'
import { RendererProps } from 'amis/lib/factory'
import { isEffectiveApi } from 'amis/lib/utils/api'
import React from 'react'

import LimitSetting, { LimitSettingProps, AuthLimitData } from '@/components/limit_setting'

type Props = RendererProps &
  LimitSettingProps & {
    button?: any
    modal?: any
    useAllLimit?: boolean
    reload?: boolean
    name?: string
    messages?: {
      initFailed: string
      saveFailed: string
      saveSuccess: string
    }
    getLimit?: (data: any) => string
  }

@Renderer({
  test: /(^|\/)lib-limit-setting$/,
  name: 'lib-limit-setting',
})
export class LibLimitSetting extends React.Component<Props> {
  render() {
    const {
      button = {},
      modal = {},
      name = 'limit',
      env,
      data,
      initApi,
      api,
      messages,
      saveConfirmText,
      useAllLimit,
      getLimit,
      render,
    } = this.props

    const actionType = button.actionType || 'dialog'

    const buttonProps = {
      actionType,
      type: 'action',
      label: '设置权限',
      icon: 'fa fa-lock',
      ...button,
    }

    const modalProps = {
      title: '设置权限',
      size: 'lg',
      showCloseButton: false,
      actions: [],
      ...modal,
    }

    const limitComponent = {
      component: (amisProps: RendererProps) => {
        const { data: limitData } = amisProps
        const initData = { ...data, ...limitData }
        const onSave = (authData: AuthLimitData) => {
          const fetchData = { ...initData, ...authData }
          if (isEffectiveApi(api, fetchData)) {
            env
              .fetcher(api, fetchData)
              .then((res) => {
                const { status, msg } = res
                const hasError = status !== 0
                if (!hasError) {
                  env.notify('success', messages?.saveSuccess || '保存成功')
                  if (this.props.reload) {
                    this.props.onQuery()
                  }
                } else {
                  env.notify('error', messages?.saveFailed || msg || '保存失败')
                }
              })
              .catch(() => {
                env.notify('error', messages?.saveFailed || '保存失败')
              })
          }
          if (this.props.onSaveClick) {
            this.props.onSaveClick(authData)
          }
        }
        return (
          <LimitSetting
            {...amisProps}
            className={`limit-drawer-${isEffectiveApi(initApi) ? 'service' : 'normal'} `}
            limit={getLimit ? getLimit(limitData) : limitData[name] || ''}
            saveConfirmText={filter(saveConfirmText, initData)}
            onSaveClick={onSave}
            useAllLimit={useAllLimit}
            onCancel={this.props.onCancelClick}
          />
        )
      },
    }

    const schema = {
      ...buttonProps,
      [actionType]: {
        ...modalProps,
        body: !isEffectiveApi(initApi)
          ? limitComponent
          : {
              type: 'service',
              className: 'h-full',
              messages: {
                fetchFailed: messages?.initFailed,
              },
              api: initApi,
              body: limitComponent,
            },
      },
    }

    return render('body', schema)
  }
}
