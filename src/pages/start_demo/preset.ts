import { PagePreset } from '~/routes/types'

import { mockSource } from './mock'

const pageLimit: PagePreset = {
  limits: {
    $page: {
      label: '查看列表',
    },
    viewItem: {
      label: '查看行',
    },
    viewToken: {
      label: '查看Token',
    },
    editItem: {
      label: '编辑',
    },
    addItem: {
      label: '添加',
      needs: ['editItem'],
    },
    delItem: {
      label: '删除',
      needs: ['addItem'],
    },
  },
  apis: {
    list: {
      mockSource,
      url: 'GET api/v1/start_demo',
      limits: '$page',
    },
    edit: {
      mockSource,
      url: 'PUT api/v1/start_demo/$id',
      limits: 'editItem',
    },
    add: {
      mockSource,
      url: 'POST api/v1/start_demo',
      limits: 'addItem',
    },
    delete: {
      mockSource,
      url: 'DELETE api/v1/start_demo/$id',
      limits: 'delItem',
    },
  },
}

export default pageLimit
