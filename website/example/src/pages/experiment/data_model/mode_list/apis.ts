import { getGlobal } from '@core/utils/store'

import { erdStoreKey } from '~/components/erd/constants'

export default {
  fakeTableTemplate: {
    url: 'GET ovhapi/model/template',
    limits: '$page',
    onFakeRequest: async () => {
      // await promisedTimeout(100000)
      return {
        data: getGlobal(erdStoreKey.modelTemplate),
      }
    },
  },
  listTable: {
    url: 'GET ovhapi/model/table',
    limits: '$page',
    domain: 'modelApi',
  },
  tableInfo: {
    url: 'GET ovhapi/model/table/$id',
    limits: '$page',
    domain: 'modelApi',
  },
  addTable: {
    url: 'POST ovhapi/model/table',
    limits: 'add',
    domain: 'modelApi',
  },
  editTable: {
    url: 'PUT ovhapi/model/table/$id',
    limits: 'edit',
    domain: 'modelApi',
  },
  delTable: {
    url: 'DELETE ovhapi/model/table/$id',
    limits: 'del',
    domain: 'modelApi',
  },
  addField: {
    url: 'POST ovhapi/model/table/$id/field',
    limits: 'add',
    domain: 'modelApi',
  },
  editField: {
    url: 'PUT ovhapi/model/table/field/$id',
    limits: 'add',
    domain: 'modelApi',
  },
  orderField: {
    url: 'PUT ovhapi/model/table/field/$id',
    limits: 'add',
    domain: 'modelApi',
  },
  delField: {
    url: 'DELETE ovhapi/model/table/field/$id',
    limits: 'add',
    domain: 'modelApi',
  },
}
