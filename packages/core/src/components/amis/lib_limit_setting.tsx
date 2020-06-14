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
    messages?: {
      initFailed: string
      saveFailed: string
      saveSuccess: string
    }
    getLimit?: () => string
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
      env,
      data,
      initApi,
      api,
      messages,
      saveConfirmText,
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
            const saveApi: any =
              typeof api === 'string'
                ? {
                    url: api,
                  }
                : api
            saveApi.data = fetchData
            saveApi.method = 'post'
            saveApi.qsOptions = {
              encode: false,
              arrayFormat: 'indices',
              encodeValuesOnly: false,
            }
            env
              .fetcher(saveApi)
              .then((res) => {
                const { status, msg } = res
                const hasError = status !== 0
                if (!hasError) {
                  env.notify('success', messages?.saveSuccess || '保存成功')
                } else {
                  env.notify('error', messages?.saveFailed || msg || '保存失败')
                }
              })
              .catch(() => {
                env.notify('error', messages?.saveFailed || '保存失败')
              })
          }
          if (this.props.onSave) {
            this.props.onSave(authData)
          }
        }
        const onCancel = () => {
          if (this.props.onCancel) {
            this.props.onCancel()
          }
        }

        return (
          <LimitSetting
            {...amisProps}
            className={`limit-drawer-${isEffectiveApi(initApi) ? 'service' : 'normal'} `}
            limit={getLimit ? getLimit() : limitData.limit || ''}
            saveConfirmText={filter(saveConfirmText, initData)}
            onSave={onSave}
            onCancel={onCancel}
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
