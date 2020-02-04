import { PagePreset } from '~/routes/route'

import { mockSource } from './mock'

const pageLimit: PagePreset = {
  limits: {
    page: {
      label: '查看列表',
    },
    viewItem: {
      label: '列表详细',
      needs: ['page'],
    },
    addItem: {
      label: '添加',
      needs: ['page'],
    },
    editItem: {
      label: '编辑',
      needs: ['page'],
    },
    editConfig: {
      needs: ['page'],
      label: '编辑配置',
    },
    delItem: {
      label: '删除',
      needs: ['page', 'viewItem', 'addItem', 'editItem', 'editConfig'],
    },
  },
  apis: {
    catList: {
      url: 'api/v1/hot_config/cat',
      limits: 'page',
    },
    list: {
      url: 'GET api/v1/hot_config',
      mockSource: mockSource['GET api/v1/hot_config'],
      limits: 'page',
    },
    add: {
      url: 'POST api/v1/hot_config',
      limits: 'add',
    },
    edit: {
      url: 'PUT api/v1/hot_config/edit/$id',
      limits: 'edit',
    },
    del: {
      url: 'DELETE api/v1/hot_config/$id',
      limits: 'del',
    },
    api: {
      url: 'api/v1/hot_config/api',
      limits: 'api',
    },
  },
}

export default pageLimit
