import { app } from '@core/app'
import { ReqOption } from '@core/utils/request/types'
import { getStore } from '@core/utils/store'
import { ObjectOf } from '@core/utils/types'

import preset from '~/pages/experiment/data_model/mode_list/preset'
import * as utils from '~/pages/experiment/data_model/mode_list/utils'

import { erdStoreKey } from '../constants'

export const modelApis = preset.apis as ObjectOf<ReqOption>
export const modelUtils = utils

export const getModelTplData = () => {
  return getStore(erdStoreKey.modelTemplate)
}

export const fetchTables = async () => {
  return app.request(modelApis.listTable).then((source) => {
    const tables = source.data.data
    return tables.map((table) => {
      const data = utils.getTableFormData(table)
      return data
    })
  })
}

export const fetchTableById = async (id: string) => {
  modelApis.tableInfo.data = { id }
  return app.request(modelApis.tableInfo).then((source) => {
    const tables = source.data
    return tables.map((table) => {
      return utils.getTableFormData(table)
    })
  })
}

export const submitErdData = () => {
  //
}
