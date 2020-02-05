import { PagePreset } from '~/routes/types'

import { mockSource } from './mock'

const pageLimit: PagePreset = {
  limits: {
    $page: {
      label: '查看列表',
    },
    viewItem: {
      label: '列表详细',
    },
    addItem: {
      label: '添加',
    },
    editItem: {
      label: '编辑',
    },
    editConfig: {
      label: '编辑配置',
    },
    delItem: {
      label: '删除',
      needs: ['viewItem', 'addItem', 'editItem', 'editConfig'],
    },
  },
  apis: {
    catList: {
      url: 'api/v1/hot_config/cat',
      limits: '$page',
    },
    list: {
      url: 'GET api/v1/hot_config',
      mockSource: mockSource['GET api/v1/hot_config'],
      limits: '$page',
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
