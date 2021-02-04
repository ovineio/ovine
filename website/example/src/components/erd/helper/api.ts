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

const parseTableToModelData = (tableSource) => {
  const { table, fields = [] } = tableSource
  const modelData = {
    id: table.id.value,
    label: table.name.value,
    desc: table.desc.value,
    fields: fields.map((field) => {
      return {
        id: field.id,
        type: field.name,
        label: field.attributes.name.value,
        desc: field.attributes.desc.value,
        required: !field.attributes.isNull.value,
        unique: false,
      }
    }),
  }

  return modelData
}

export const fetchTables = async () => {
  return app.request(modelApis.listTable).then((source) => {
    const tables = source.data.data
    return tables.map((table) => {
      return parseTableToModelData(table)
    })
  })
}

export const fetchTableById = async (id: string) => {
  modelApis.tableInfo.data = { id }
  return app.request(modelApis.tableInfo).then((source) => {
    const tables = source.data
    return tables.map((table) => {
      return parseTableToModelData(table)
    })
  })
}
