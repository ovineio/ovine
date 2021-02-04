/**
 * 页面预设值，本文件不要引入模块
 */
import { getGlobal } from '@core/utils/store'

import { erdStoreKey } from '~/components/erd/constants'

export default {
  // 页面需要用到的权限定义
  limits: {
    // 路由权限
    $page: {
      label: '查看列表',
    },
    add: {
      label: '添加',
    },
    edit: {
      label: '编辑',
    },
    del: {
      label: '删除',
    },
  },
  // 页面需要用到的 api定义
  apis: {
    fakeTableTemplate: {
      url: 'GET ovhapi/model/template',
      limits: '$page',
      onFakeRequest: async () => {
        // await promisedTimeout(100000)
        return {
          data: getGlobal(erdStoreKey.modelTemplate),
        }
      },
      // onSuccess: (source) => {
      //   setGlobal('pageModelTemplate', source.data)
      //   return source
      // },
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
    testList: {
      url: 'GET ovapi/system/log/item',
    },
  },
}
