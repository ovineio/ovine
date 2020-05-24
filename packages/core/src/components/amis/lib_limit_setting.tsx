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
      size: 'md',
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
            if (typeof api !== 'string') {
              api.qsOptions = {
                encode: false,
              }
              api.data = fetchData
            }
            env.fetcher(api)
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
              api: initApi,
              body: limitComponent,
            },
      },
    }

    return render('body', schema)
  }
}
