import React from 'react'

import { app } from '@core/app'
import LimitSetting from '@core/components/limit_setting'
import { storage } from '@core/constants'
import { setStore } from '@core/utils/store'

export default (props: any) => {
  const { data, store } = props
  const { limit = '', __super } = data
  const { id, name } = __super

  return (
    <LimitSetting
      authLimit={limit}
      saveConfirmText={`您正在修改的角色是【${name}】，提交后将不可重置，是否确认提交？`}
      onCancel={() => {
        store.closeDialog()
      }}
      onSaveLimit={({ authLimit, authApi }) => {
        app.request({
          url: 'PUT rtapi/system/role/item/${id}/limit',
          data: {
            id,
            limit: authLimit,
            api: authApi,
          },
          onSuccess: () => {
            setStore(storage.dev.limit, authLimit)
            setStore(storage.dev.api, authApi)
            store.closeDialog()
          },
        })
      }}
    />
  )
}
