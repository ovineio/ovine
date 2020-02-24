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
      mockSource,
      url: 'api/v1/hot_config/cat',
      limits: '$page',
    },
    list: {
      mockSource,
      url: 'GET api/v1/hot_config',
      limits: '$page',
    },
    add: {
      mockSource,
      url: 'POST api/v1/hot_config',
      limits: 'add',
    },
    edit: {
      mockSource,
      url: 'PUT api/v1/hot_config/edit/$id',
      limits: 'edit',
    },
    del: {
      mockSource,
      url: 'DELETE api/v1/hot_config/$id',
      limits: 'del',
    },
    api: {
      mockSource,
      url: 'api/v1/hot_config/api',
      limits: 'api',
    },
  },
}

export default pageLimit
