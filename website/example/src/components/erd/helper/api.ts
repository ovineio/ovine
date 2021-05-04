import { app } from '@core/app'
import { ReqOption } from '@core/utils/request/types'
import { getGlobal } from '@core/utils/store'
import { ObjectOf } from '@core/utils/types'

import apis from '~/pages/experiment/data_model/mode_list/apis'
import * as utils from '~/pages/experiment/data_model/mode_list/utils'

import { erdStoreKey } from '../constants'

export const modelApis = apis as ObjectOf<ReqOption>
export const modelUtils = utils

export const getModelTplData = () => {
  return getGlobal<any>(erdStoreKey.modelTemplate)
}

export const fetchTables = async () => {
  return app.request(modelApis.listTable).then((source) => {
    const tables = source.data.data
    return getTablesData(tables)
  })
}

export const fetchModelMap = async () => {
  return app.request(modelApis.modelMap).then((source) => {
    const { modelDatas, relationships } = source.data.data
    const result = {
      tables: getTablesData(modelDatas),
      relationships,
    }
    return result
  })
}

export const getTablesData = (tables) => {
  const modeTables = tables.map((table) => {
    const data = utils.getTableFormData(table)
    return data
  })

  return modeTables
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

export const checkErdData = () => {
  //
}

export const saveToDraft = () => {
  //
}

export const saveToServer = () => {
  //
}
