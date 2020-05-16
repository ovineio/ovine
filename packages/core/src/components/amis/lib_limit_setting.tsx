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

const LibLimitSetting = (props: Props) => {
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
  } = props

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
          env.fetcher(api, fetchData)
        }
        if (props.onSave) {
          props.onSave(authData)
        }
      }
      const onCancel = () => {
        if (props.onCancel) {
          props.onCancel()
        }
      }

      return (
        <LimitSetting
          {...amisProps}
          className={`limit-modal-${actionType}`}
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
            api: initApi,
            body: limitComponent,
          },
    },
  }

  return render('body', schema)
}

Renderer({
  test: /(^|\/)lib-limit-setting$/,
  name: 'lib-limit-setting',
})(LibLimitSetting as any)
